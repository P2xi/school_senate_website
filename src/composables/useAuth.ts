import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { computed, ref } from 'vue'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const session = ref<Session | null>(null)
const isLoading = ref(true)
const recoveryRequested = ref(false)
let initialization: Promise<void> | null = null
let auditSessionInFlight: string | null = null
const canonicalSiteUrl = 'https://www.eskisehirmbasenato.org'
const loginAuditStorageKey = 'senato:last-audited-session'

const getSessionId = (currentSession: Session) => {
  try {
    const encodedPayload = currentSession.access_token.split('.')[1]
    if (!encodedPayload) return null
    const normalized = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const payload = JSON.parse(atob(padded)) as { session_id?: unknown }
    return typeof payload.session_id === 'string' ? payload.session_id : null
  } catch {
    return null
  }
}

const recordSuccessfulLogin = async (currentSession: Session) => {
  if (!supabase) return
  const sessionId = getSessionId(currentSession)
  if (!sessionId || auditSessionInFlight === sessionId) return

  try {
    if (window.localStorage.getItem(loginAuditStorageKey) === sessionId) return
  } catch {
    // Storage can be unavailable in strict privacy modes; the in-memory guard still applies.
  }

  auditSessionInFlight = sessionId
  try {
    const { error } = await supabase.functions.invoke('record-login', { body: {} })
    if (error) {
      console.warn('Giriş denetim kaydı oluşturulamadı.')
      return
    }
    try {
      window.localStorage.setItem(loginAuditStorageKey, sessionId)
    } catch {
      // The audit succeeded; failing to persist the optimization is non-fatal.
    }
  } finally {
    if (auditSessionInFlight === sessionId) auditSessionInFlight = null
  }
}

const getAuthRedirectOrigin = () => {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim()
  const origin = import.meta.env.PROD
    ? canonicalSiteUrl
    : configuredSiteUrl || canonicalSiteUrl

  return origin.replace(/\/$/, '')
}

const requireClient = () => {
  if (!supabase) {
    throw new Error('Supabase bağlantısı henüz yapılandırılmadı.')
  }

  return supabase
}

export const initializeAuth = () => {
  if (initialization) return initialization

  if (!supabase) {
    isLoading.value = false
    initialization = Promise.resolve()
    return initialization
  }

  const { data } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, nextSession: Session | null) => {
    session.value = nextSession
    isLoading.value = false

    if (event === 'PASSWORD_RECOVERY') {
      recoveryRequested.value = true
    }

    if (event === 'SIGNED_IN' && nextSession) {
      queueMicrotask(() => void recordSuccessfulLogin(nextSession))
    }
  })

  initialization = supabase.auth
    .getSession()
    .then(({ data: sessionData }) => {
      session.value = sessionData.session
    })
    .finally(() => {
      isLoading.value = false
    })

  if (import.meta.hot) {
    import.meta.hot.dispose(() => data.subscription.unsubscribe())
  }

  return initialization
}

export const useAuth = () => {
  const user = computed<User | null>(() => session.value?.user ?? null)
  const displayName = computed(() => {
    const fullName = user.value?.user_metadata?.full_name
    return typeof fullName === 'string' && fullName.trim() ? fullName.trim() : user.value?.email ?? 'Üye'
  })

  const signUp = async (fullName: string, email: string, password: string, captchaToken?: string) => {
    const client = requireClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${getAuthRedirectOrigin()}/uyelik`,
        captchaToken,
      },
    })

    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    const client = requireClient()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const client = requireClient()
    const { error } = await client.auth.signOut()
    if (error) throw error
  }

  const sendPasswordReset = async (email: string, captchaToken?: string) => {
  const client = requireClient()
  const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${getAuthRedirectOrigin()}/uyelik`,
      captchaToken,
    })
    if (error) throw error
  }

  const updatePassword = async (password: string) => {
    const client = requireClient()
    const { error } = await client.auth.updateUser({ password })
    if (error) throw error
    recoveryRequested.value = false
  }

  return {
    session,
    user,
    displayName,
    isLoading,
    isConfigured: isSupabaseConfigured,
    recoveryRequested,
    initializeAuth,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
  }
}

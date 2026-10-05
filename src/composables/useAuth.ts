import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { computed, ref } from 'vue'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const session = ref<Session | null>(null)
const isLoading = ref(true)
const recoveryRequested = ref(false)
let initialization: Promise<void> | null = null

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

  const signUp = async (fullName: string, email: string, password: string) => {
    const client = requireClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/uyelik`,
      },
    })

    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const client = requireClient()
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const client = requireClient()
    const { error } = await client.auth.signOut()
    if (error) throw error
  }

  const sendPasswordReset = async (email: string) => {
    const client = requireClient()
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/uyelik?mode=reset`,
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

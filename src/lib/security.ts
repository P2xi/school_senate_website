import { supabase } from '@/lib/supabase'

export type LoginEvent = {
  id: number
  user_id: string
  email: string
  session_id: string
  ip_address: string | null
  country_code: string | null
  user_agent: string | null
  device_type: 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown'
  browser_name: string | null
  operating_system: string | null
  auth_provider: string | null
  assurance_level: string | null
  risk_flags: string[]
  first_seen_at: string
  last_seen_at: string
}

export type SecuritySummary = {
  successful_sessions: number
  unique_accounts: number
  unique_ips: number
  flagged_sessions: number
  last_event_at: string | null
}

export type AdminUserActivity = {
  user_id: string
  email: string
  full_name: string
  role: 'member' | 'senator' | 'admin'
  inbox_key: string | null
  created_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  last_login_ip: string | null
  last_login_country: string | null
  last_device_type: string | null
  last_browser_name: string | null
  last_operating_system: string | null
  last_login_recorded_at: string | null
}

const requireClient = () => {
  if (!supabase) throw new Error('Supabase bağlantısı yapılandırılmadı.')
  return supabase
}

export const getLoginEvents = async (limit = 250) => {
  const { data, error } = await requireClient()
    .from('login_events')
    .select('*')
    .order('last_seen_at', { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 500))

  if (error) throw error
  return (data ?? []) as LoginEvent[]
}

export const getSecuritySummary = async (days = 30) => {
  const { data, error } = await requireClient()
    .rpc('get_security_summary', { lookback_days: days })
    .single()

  if (error) throw error
  return data as SecuritySummary
}

export const getAdminUserActivity = async () => {
  const { data, error } = await requireClient().rpc('get_admin_user_activity')

  if (error) throw error
  return (data ?? []) as AdminUserActivity[]
}

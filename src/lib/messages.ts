import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { SenateRecipientKey } from '@/data/senateRecipients'

export type ProfileRole = 'member' | 'senator' | 'admin'
export type MessageStatus = 'new' | 'in_progress' | 'answered' | 'closed'

export type MemberProfile = {
  id: string
  full_name: string
  role: ProfileRole
  inbox_key: SenateRecipientKey | null
}

export type SenateMessage = {
  id: string
  sender_id: string
  sender_name: string
  sender_email: string
  recipient_key: SenateRecipientKey
  subject: string
  body: string
  status: MessageStatus
  created_at: string
  updated_at: string
}

export type MessageReply = {
  id: string
  message_id: string
  author_id: string
  author_name: string
  author_role: ProfileRole
  body: string
  created_at: string
}

const requireClient = () => {
  if (!supabase) throw new Error('Supabase bağlantısı yapılandırılmadı.')
  return supabase
}

const isMissingRpcError = (error: unknown) =>
  (error as { code?: string } | null)?.code === 'PGRST202'

const messageColumns = 'id, sender_id, sender_name, sender_email, recipient_key, subject, body, status, created_at, updated_at'
const replyColumns = 'id, message_id, author_id, author_name, author_role, body, created_at'

export const getMyProfile = async () => {
  const client = requireClient()
  const { data: authData, error: authError } = await client.auth.getUser()
  if (authError || !authData.user) throw authError ?? new Error('Oturum bulunamadı.')

  const profileQuery = await client
    .from('profiles')
    .select('id, full_name, role, inbox_key')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (profileQuery.error) throw profileQuery.error
  if (profileQuery.data) return profileQuery.data as MemberProfile

  const { error: ensureError } = await client.rpc('ensure_my_profile')
  if (ensureError) throw ensureError

  const { data, error } = await client
    .from('profiles')
    .select('id, full_name, role, inbox_key')
    .eq('id', authData.user.id)
    .single()

  if (error) throw error
  return data as MemberProfile
}

export const createMessage = async (payload: {
  recipientKey: SenateRecipientKey
  subject: string
  body: string
}) => {
  const client = requireClient()
  const { data, error } = await client
    .rpc('send_message', {
      p_recipient_key: payload.recipientKey,
      p_subject: payload.subject,
      p_body: payload.body,
    })

  if (error && isMissingRpcError(error)) {
    const fallback = await client
      .from('messages')
      .insert({
        recipient_key: payload.recipientKey,
        subject: payload.subject,
        body: payload.body,
      })
      .select('id')
      .single()
    if (fallback.error) throw fallback.error
    return fallback.data as { id: string }
  }
  if (error) throw error
  return { id: data as string }
}

export const getAccessibleMessages = async (limit = 75, before?: string) => {
  const client = requireClient()
  const pageSize = Math.min(Math.max(limit, 1), 200)
  let query = client
    .from('messages')
    .select(messageColumns)
    .order('created_at', { ascending: false })
    .limit(pageSize + 1)

  if (before) query = query.lt('created_at', before)

  const { data, error } = await query

  if (error) throw error
  const rows = (data ?? []) as SenateMessage[]
  return {
    messages: rows.slice(0, pageSize),
    hasMore: rows.length > pageSize,
  }
}

export const getMessageReplies = async (messageId: string, limit = 200) => {
  const client = requireClient()
  const { data, error } = await client
    .from('message_replies')
    .select(replyColumns)
    .eq('message_id', messageId)
    .order('created_at', { ascending: true })
    .limit(Math.min(Math.max(limit, 1), 500))

  if (error) throw error
  return (data ?? []) as MessageReply[]
}

export const createReply = async (messageId: string, body: string) => {
  const client = requireClient()
  const { error } = await client.rpc('send_message_reply', {
    p_message_id: messageId,
    p_body: body,
  })
  if (error && isMissingRpcError(error)) {
    const fallback = await client.from('message_replies').insert({ message_id: messageId, body })
    if (fallback.error) throw fallback.error
    return
  }
  if (error) throw error
}

export const setMessageStatus = async (messageId: string, status: MessageStatus) => {
  const client = requireClient()
  const { error } = await client.rpc('change_message_status', {
    p_message_id: messageId,
    p_status: status,
  })
  if (error && isMissingRpcError(error)) {
    const fallback = await client.from('messages').update({ status }).eq('id', messageId)
    if (fallback.error) throw fallback.error
    return
  }
  if (error) throw error
}

export const subscribeToMessaging = (onChange: () => void): RealtimeChannel => {
  const client = requireClient()
  return client
    .channel(`message-center-${crypto.randomUUID()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'message_replies' }, onChange)
    .subscribe()
}

export const unsubscribeFromMessaging = async (channel: RealtimeChannel | null) => {
  if (!channel || !supabase) return
  await supabase.removeChannel(channel)
}

export const isMessagingSchemaError = (error: unknown) => {
  const candidate = error as { code?: string; message?: string } | null
  const message = candidate?.message ?? (error instanceof Error ? error.message : String(error ?? ''))
  return candidate?.code === 'PGRST202'
    || /relation .* does not exist|could not find the table|schema cache|function .* does not exist|ensure_my_profile|send_message/i.test(message)
}

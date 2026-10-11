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

export const getMyProfile = async () => {
  const client = requireClient()
  const { data, error } = await client
    .from('profiles')
    .select('id, full_name, role, inbox_key')
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
    .from('messages')
    .insert({
      recipient_key: payload.recipientKey,
      subject: payload.subject,
      body: payload.body,
    })
    .select('id')
    .single()

  if (error) throw error
  return data as { id: string }
}

export const getAccessibleMessages = async () => {
  const client = requireClient()
  const { data, error } = await client
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SenateMessage[]
}

export const getMessageReplies = async (messageId: string) => {
  const client = requireClient()
  const { data, error } = await client
    .from('message_replies')
    .select('*')
    .eq('message_id', messageId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as MessageReply[]
}

export const createReply = async (messageId: string, body: string) => {
  const client = requireClient()
  const { error } = await client.from('message_replies').insert({ message_id: messageId, body })
  if (error) throw error
}

export const setMessageStatus = async (messageId: string, status: MessageStatus) => {
  const client = requireClient()
  const { error } = await client.from('messages').update({ status }).eq('id', messageId)
  if (error) throw error
}

export const isMessagingSchemaError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /relation .* does not exist|could not find the table|schema cache|profiles/i.test(message)
}


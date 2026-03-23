import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export function useContactMessages() {
  const sending = ref(false)
  const error = ref<string | null>(null)

  const sendContactMessage = async (payload: ContactPayload) => {
    sending.value = true
    error.value = null

    const { error: insertError } = await supabase.from('contact_messages').insert(payload)

    sending.value = false

    if (insertError) {
      error.value = insertError.message
      return { success: false as const, error: insertError.message }
    }

    return { success: true as const, error: null }
  }

  return {
    sending,
    error,
    sendContactMessage,
  }
}

import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export type SenateEvent = {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  created_at: string
}

export function useEvents() {
  const events = ref<SenateEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('events')
      .select('id, title, description, event_date, location, created_at')
      .order('event_date', { ascending: true })

    if (fetchError) {
      error.value = fetchError.message
      events.value = []
    } else {
      events.value = data ?? []
    }

    loading.value = false
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
  }
}

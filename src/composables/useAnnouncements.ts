import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export type Announcement = {
  id: string
  title: string
  content: string
  created_at: string
  published: boolean
}

export function useAnnouncements() {
  const announcements = ref<Announcement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAnnouncements = async () => {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('announcements')
      .select('id, title, content, created_at, published')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (fetchError) {
      error.value = fetchError.message
      announcements.value = []
    } else {
      announcements.value = data ?? []
    }

    loading.value = false
  }

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
  }
}

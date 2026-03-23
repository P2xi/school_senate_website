import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

console.log('SUPABASE URL:', url)
console.log('SUPABASE KEY:', key)

if (!url || !key) {
  throw new Error(
    'Supabase env eksik: VITE_SUPABASE_URL ve VITE_SUPABASE_PUBLISHABLE_KEY tanimlanmalidir.'
  )
}

export const supabase = createClient(url, key)
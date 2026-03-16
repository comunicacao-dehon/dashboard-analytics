import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://twzovmrgohqxmynroooo.supabase.co"
const supabaseKey = "sb_publishable_NQzHYiKmQZB7ROCAr2TuWw_E26gLz5A"

export const supabase = createClient(supabaseUrl, supabaseKey)

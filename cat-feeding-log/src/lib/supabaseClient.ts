import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euifpvurisvbhcttfbdv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1aWZwdnVyaXN2YmhjdHRmYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjU5MTUsImV4cCI6MjA3MjI0MTkxNX0.GsIYql3SA7hol73VI82Hk2z-ea23ZMW5I5RImYN-cKc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

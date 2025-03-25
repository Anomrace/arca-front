// src/boot/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wripfhsvsikjuybzrsak.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaXBmaHN2c2lranV5Ynpyc2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzI1NzIsImV4cCI6MjA1Nzc0ODU3Mn0.WV5diq1FjuKPi9IvwInaOqklzJjDz-A8yRREUZsE4kY'
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

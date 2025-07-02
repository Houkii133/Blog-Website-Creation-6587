import { createClient } from '@supabase/supabase-js'

// Project credentials - safe for frontend use
const SUPABASE_URL = 'https://esmfevnljgdejvqdftbu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbWZldm5samdkZWp2cWRmdGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MDc3NTcsImV4cCI6MjA2Njk4Mzc1N30.cpTv94pWhFJCxylVc1nxKRvHtaC3Q7PxbPz1HfOSH9o'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
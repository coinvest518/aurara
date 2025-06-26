import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validate Supabase configuration
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration:", {
    urlExists: !!supabaseUrl, 
    keyExists: !!supabaseKey
  });
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[supabaseClient] Missing Supabase environment variables:', { SUPABASE_URL, SUPABASE_ANON_KEY });
  throw new Error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. See README.md');
}

console.log(
  '[supabaseClient] initialized with:',
  SUPABASE_URL,
  SUPABASE_ANON_KEY?.slice(0, 10) + '...'
);


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//import { createClient } from '@supabase/supabase-js';
//
//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Use NEXT_PUBLIC_ for client-side
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
//
//export const supabase = createClient(supabaseUrl, supabaseAnonKey);
//
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'; // Fallback for local testing
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-local-anon-key'; // Replace with local key for testing

console.log('Supabase URL from env:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key from env:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing. Check Vercel env vars.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

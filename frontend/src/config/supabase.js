import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env'
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : {
        auth: {
          getSession: async () => ({
            data: { session: null },
            error: null,
          }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe() {} } },
          }),
          signInWithPassword: async () => ({
            data: { user: null, session: null },
            error: new Error('Supabase is not configured.'),
          }),
          signUp: async () => ({
            data: { user: null, session: null },
            error: new Error('Supabase is not configured.'),
          }),
          signOut: async () => ({
            error: new Error('Supabase is not configured.'),
          }),
        },
      };

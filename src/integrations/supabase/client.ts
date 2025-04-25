
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vskzyeurkubazrigfnau.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'lovable-app'
      }
    }
  }
);

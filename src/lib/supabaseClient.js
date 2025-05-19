import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully.');
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    supabaseInstance = null;
  }
} else {
  console.warn('Supabase URL or Anon Key is not provided. Supabase client not initialized.');
}

export const supabase = supabaseInstance;
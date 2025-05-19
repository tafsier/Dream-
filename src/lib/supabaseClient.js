import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        console.log("Supabase client initialized successfully.");
    } catch (error) {
        console.error("Error creating supabase client:", error);
        supabaseInstance = null;
    }
} else {
    console.warn("Supabase URL or Anon Key is not provided. Supabase client not initialized.");
}

export const supabase = supabaseInstance;
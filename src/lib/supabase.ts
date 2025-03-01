import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to development defaults
// In a real app, you'd set these in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback storage mechanism for when Supabase is not properly configured
export const fallbackStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

// Check if Supabase connection is functioning
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // If using default values, we're definitely not connected
    if (supabaseUrl === 'https://example.supabase.co') {
      return false;
    }
    
    // Try a simple request to verify connection
    try {
      const { error } = await supabase.from('health_check').select('*').limit(1).maybeSingle();
      
      // If there's no error, or the error is just that the table doesn't exist
      // (which would happen in a fresh Supabase instance), count it as connected
      if (!error || error.code === 'PGRST116') {
        console.log('Supabase connection successful');
        return true;
      }
      
      // Log error but return false so app falls back to localStorage
      console.warn('Supabase connection issue:', error);
      return false;
    } catch (err) {
      console.warn('Failed to query Supabase:', err);
      return false;
    }
  } catch (err) {
    console.warn('Failed to connect to Supabase, using localStorage instead:', err);
    return false;
  }
};

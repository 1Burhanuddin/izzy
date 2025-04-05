
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ohxpyhrzonbgpbnvtyru.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHB5aHJ6b25iZ3BibnZ0eXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzOTg1ODksImV4cCI6MjA1Njk3NDU4OX0.2l0ftdMQd_IjHngtQ4L7Lae7mA2VosTMkxQJtb7SI1o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true, 
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

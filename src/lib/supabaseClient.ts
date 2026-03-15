import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://your-project-ref.supabase.co'; // Replace with your actual supabase url
const supabaseAnonKey = 'your-anon-key'; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
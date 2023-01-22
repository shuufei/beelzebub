import { createClient } from '@supabase/supabase-js';

export const supabaseServerClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_SUPABASE_SERVICE_KEY
);

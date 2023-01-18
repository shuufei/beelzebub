import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NX_PUBLIC_SUPABASE_URL,
  process.env.NX_SUPABASE_PUBLIC_KEY
);

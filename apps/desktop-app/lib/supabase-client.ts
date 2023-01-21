import { createClient } from '@supabase/supabase-js';

export const supabaseForServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_SUPABASE_SERVICE_KEY
);

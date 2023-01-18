import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const getSupabaseForServer = () => {
  return createClient(
    process.env.PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string
  );
};

const getPresignedUrl = async () => {
  console.log('hello world');
  const supabase = getSupabaseForServer();
  const { data, error } = await supabase.storage
    .from('app-static-resources')
    .createSignedUrls(['cards/images/BT01/BT1-001.png'], 60);
  // .createSignedUrls(['cards/images/BT01'], 60);
  console.log('--- data: ', data, error);
};

await getPresignedUrl();

export {};

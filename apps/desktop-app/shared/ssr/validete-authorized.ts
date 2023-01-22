import { Unauthorized } from '@beelzebub/shared/errors';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';

export const validateAuthorized = async (
  ctx: Parameters<GetServerSideProps>[0]
) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Unauthorized();
  }
  return;
};

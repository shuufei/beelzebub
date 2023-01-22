import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export const isPermitted = async (
  req: NextApiRequest,
  res: NextApiResponse,
  isAdminOnly = false
) => {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  if (user == null) {
    return false;
  }
  if (isAdminOnly) {
    return user.email === process.env.NEXT_ADMIN_USER_EMAIL;
  }
  return true;
};

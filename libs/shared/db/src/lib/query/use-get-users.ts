import { User } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useSWR from 'swr';
import { z } from 'zod';
import { convertToUser, UserDB } from '../users';

export const useGetUsers = () => {
  const supabaseClient = useSupabaseClient();
  return useSWR('/supabase/db/users', async () => {
    const result = await supabaseClient.from('users').select();
    if (result.error != null) {
      throw new Error(`failed select users: ${JSON.stringify(result.error)}`);
    }
    const parsed = z.array(UserDB).parse(result.data);
    const users: User[] = parsed.map(convertToUser);
    return users;
  });
};

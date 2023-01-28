import { User } from '@beelzebub/shared/domain';
import { z } from 'zod';

export const UserDB = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  created_at: z.string(),
});

export type UserDB = z.infer<typeof UserDB>;

export const convertToUser = (data: UserDB): User => {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    createdAt: data.created_at,
  };
};

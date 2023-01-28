import { z } from 'zod';

export const User = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
});

export type User = z.infer<typeof User>;

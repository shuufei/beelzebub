import { z } from 'zod';

export const Deck = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  userId: z.string().uuid(),
  public: z.boolean(),
});

export type Deck = z.infer<typeof Deck>;

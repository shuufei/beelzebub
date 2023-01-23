import { Deck } from '@beelzebub/shared/domain';
import { z } from 'zod';

export const DeckDB = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  user_id: z.string().uuid(),
  public: z.boolean(),
});

export type DeckDB = z.infer<typeof DeckDB>;

export const convertToDeck = (data: DeckDB): Deck => {
  return {
    id: data.id,
    createdAt: data.created_at,
    userId: data.user_id,
    public: data.public,
  };
};

export const convertToDeckDB = (data: Deck): DeckDB => {
  return {
    id: data.id,
    created_at: data.createdAt,
    user_id: data.userId,
    public: data.public,
  };
};

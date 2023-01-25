import { Deck } from '@beelzebub/shared/domain';
import { z } from 'zod';
import { CardDB } from './cards';
import { CategoryDB } from './categories';

export const DeckDB = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  user_id: z.string().uuid(),
  public: z.boolean(),
  name: z.string(),
  key_card: z
    .object({
      img_file_name: CardDB.shape.img_file_name,
      category_id: CategoryDB.shape.id,
    })
    .optional()
    .nullable(),
});

export type DeckDB = z.infer<typeof DeckDB>;

export const convertToDeck = (data: DeckDB): Deck => {
  return {
    id: data.id,
    createdAt: data.created_at,
    userId: data.user_id,
    public: data.public,
    name: data.name,
    keyCard:
      data.key_card == null
        ? undefined
        : {
            imgFileName: data.key_card.img_file_name,
            categoryId: data.key_card.category_id,
          },
  };
};

export const convertToDeckDB = (data: Deck): DeckDB => {
  return {
    id: data.id,
    created_at: data.createdAt,
    user_id: data.userId,
    public: data.public,
    name: data.name,
    key_card:
      data.keyCard == null
        ? undefined
        : {
            img_file_name: data.keyCard.imgFileName,
            category_id: data.keyCard.categoryId,
          },
  };
};

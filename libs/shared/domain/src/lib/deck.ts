import { z } from 'zod';
import { Card } from './card';
import { Category } from './category';

export const Deck = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  userId: z.string().uuid(),
  public: z.boolean(),
  name: z.string(),
  keyCard: z
    .object({
      imgFileName: Card.shape.imgFileName,
      categoryId: Category.shape.id,
    })
    .optional(),
});

export type Deck = z.infer<typeof Deck>;

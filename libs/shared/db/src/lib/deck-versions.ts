import { DeckVersion } from '@beelzebub/shared/domain';
import { z } from 'zod';
import { CardDB } from './cards';
import { CategoryDB } from './categories';
import { DeckDB } from './decks';

export const DeckVersionDB = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  deck_id: DeckDB.shape.id,
  cards: z.array(
    z.object({
      img_file_name: CardDB.shape.img_file_name,
      category_id: CategoryDB.shape.id,
      count: z.number(),
    })
  ),
  adjustment_cards: z.array(
    z.object({
      img_file_name: CardDB.shape.img_file_name,
      category_id: CategoryDB.shape.id,
    })
  ),
  user_id: z.string().uuid(),
  comment: z.string().optional().nullable(),
});

export type DeckVersionDB = z.infer<typeof DeckVersionDB>;

export const convertToDeckVersion = (data: DeckVersionDB): DeckVersion => {
  return {
    id: data.id,
    createdAt: data.created_at,
    deckId: data.deck_id,
    cards: data.cards.map((v) => ({
      imgFileName: v.img_file_name,
      categoryId: v.category_id,
      count: v.count,
    })),
    adjustmentCards: data.adjustment_cards.map((v) => ({
      imgFileName: v.img_file_name,
      categoryId: v.category_id,
    })),
    userId: data.user_id,
    comment: data.comment ?? undefined,
  };
};

export const convertToDeckVersionDB = (data: DeckVersion): DeckVersionDB => {
  return {
    id: data.id,
    created_at: data.createdAt,
    deck_id: data.deckId,
    cards: data.cards.map((v) => ({
      img_file_name: v.imgFileName,
      category_id: v.categoryId,
      count: v.count,
    })),
    adjustment_cards: data.adjustmentCards.map((v) => ({
      img_file_name: v.imgFileName,
      category_id: v.categoryId,
    })),
    user_id: data.userId,
    comment: data.comment,
  };
};

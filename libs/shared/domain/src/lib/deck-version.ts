import { z } from 'zod';
import { Card } from './card';
import { Category } from './category';
import { Deck } from './deck';

export const DeckVersion = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  deckId: Deck.shape.id,
  cards: z.array(
    z.object({
      imgFileName: Card.shape.imgFileName,
      categoryId: Category.shape.id,
      count: z.number(),
    })
  ),
  adjustmentCards: z.array(
    z.object({
      imgFileName: Card.shape.imgFileName,
      categoryId: Category.shape.id,
    })
  ),
  userId: z.string().uuid(),
  comment: z.string().optional(),
});

export type DeckVersion = z.infer<typeof DeckVersion>;

export const flatDeckCards = (
  deckCards: DeckVersion['cards'],
  cards: Card[]
): Card[] => {
  return deckCards
    .map(({ imgFileName, count }) => {
      const card = cards?.find((v) => v.imgFileName === imgFileName);
      if (card == null) return [];
      return new Array<Card>(count).fill(card);
    })
    .flat();
};

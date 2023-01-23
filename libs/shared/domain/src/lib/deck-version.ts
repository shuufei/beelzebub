import { z } from 'zod';
import { Card } from './card';
import { Deck } from './deck';

export const DeckVersion = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  deckId: Deck.shape.id,
  name: z.string(),
  keyCard: z.string().optional(),
  cards: z.array(
    z.object({
      imgFileName: Card.shape.imgFileName,
      count: z.number(),
    })
  ),
  adjustmentCards: z.array(
    z.object({
      imgFileName: Card.shape.imgFileName,
      count: z.number(),
    })
  ),
  userId: z.string().uuid(),
});

export type DeckVersion = z.infer<typeof DeckVersion>;

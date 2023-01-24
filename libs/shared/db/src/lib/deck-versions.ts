import { DeckVersion } from '@beelzebub/shared/domain';
import { z } from 'zod';
import { CardDB } from './cards';
import { DeckDB } from './decks';

export const DeckVersionDB = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  deck_id: DeckDB.shape.id,
  name: z.string(),
  key_card: z.string().optional().nullable(),
  cards: z.array(
    z.object({
      img_file_name: CardDB.shape.img_file_name,
      count: z.number(),
    })
  ),
  adjustment_cards: z.array(
    z.object({
      img_file_name: CardDB.shape.img_file_name,
      count: z.number(),
    })
  ),
  user_id: z.string().uuid(),
});

export type DeckVersionDB = z.infer<typeof DeckVersionDB>;

export const convertToDeckVersion = (data: DeckVersionDB): DeckVersion => {
  return {
    id: data.id,
    createdAt: data.created_at,
    deckId: data.deck_id,
    name: data.name,
    keyCard: data.key_card ?? '',
    cards: data.cards.map((v) => ({
      imgFileName: v.img_file_name,
      count: v.count,
    })),
    adjustmentCards: data.adjustment_cards.map((v) => ({
      imgFileName: v.img_file_name,
      count: v.count,
    })),
    userId: data.user_id,
  };
};

export const convertToDeckVersionDB = (data: DeckVersion): DeckVersionDB => {
  return {
    id: data.id,
    created_at: data.createdAt,
    deck_id: data.deckId,
    name: data.name,
    key_card: data.keyCard,
    cards: data.cards.map((v) => ({
      img_file_name: v.imgFileName,
      count: v.count,
    })),
    adjustment_cards: data.adjustmentCards.map((v) => ({
      img_file_name: v.imgFileName,
      count: v.count,
    })),
    user_id: data.userId,
  };
};

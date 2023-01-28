import { atom } from 'recoil';
import { DeckCard } from '../../domain/deck-card';

export type DeckCardsState = DeckCard[];

export const deckCardsState = atom<DeckCardsState>({
  key: 'deckCardsState',
  default: [],
});

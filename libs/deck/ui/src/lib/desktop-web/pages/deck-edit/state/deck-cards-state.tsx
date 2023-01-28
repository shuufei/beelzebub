import { atom } from 'recoil';
import { DeckCard } from '@beelzebub/deck/domain';

export type DeckCardsState = DeckCard[];

export const deckCardsState = atom<DeckCardsState>({
  key: 'deckCardsState',
  default: [],
});

import { atom } from 'recoil';
import { DeckCard } from '../domain/deck-card';

export type AdjustmentDeckCardsState = DeckCard[];

export const adjustmentDeckCardsState = atom<AdjustmentDeckCardsState>({
  key: 'adjustmentDeckCardsEditState',
  default: [],
});

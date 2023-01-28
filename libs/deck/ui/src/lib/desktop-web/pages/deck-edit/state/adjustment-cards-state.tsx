import { Card } from '@beelzebub/shared/domain';
import { atom } from 'recoil';

export type AdjustmentCardsState = Card[];

export const adjustmentCardsState = atom<AdjustmentCardsState>({
  key: 'adjustmentDeckCardsEditState',
  default: [],
});

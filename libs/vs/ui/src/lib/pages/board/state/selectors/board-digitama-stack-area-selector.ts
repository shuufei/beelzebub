import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardDigitamaStackAreaSelector = selectorFamily({
  key: 'boardDigitamaStackAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).digitamaStack;
    },
});

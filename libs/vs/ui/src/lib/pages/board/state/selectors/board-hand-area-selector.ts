import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardHandAreaSelector = selectorFamily({
  key: 'boardHandAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).hand;
    },
});

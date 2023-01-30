import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardTrashAreaSelector = selectorFamily({
  key: 'boardTrashAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).trash;
    },
});

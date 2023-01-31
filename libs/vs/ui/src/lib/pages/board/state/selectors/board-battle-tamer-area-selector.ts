import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardBattleTamerAreaSelector = selectorFamily({
  key: 'boardBattleTamerAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).battleTamer;
    },
});

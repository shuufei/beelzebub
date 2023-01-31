import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardBattleOptionAreaSelector = selectorFamily({
  key: 'boardBattleOptionAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).battleOption;
    },
});

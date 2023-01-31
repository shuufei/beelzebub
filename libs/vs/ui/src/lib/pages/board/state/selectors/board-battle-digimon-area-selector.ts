import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardBattleDigimonAreaSelector = selectorFamily({
  key: 'boardBattleDigimonAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).battleDigimon;
    },
});

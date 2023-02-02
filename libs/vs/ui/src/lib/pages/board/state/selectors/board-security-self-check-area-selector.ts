import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardSecuritySelfCheckAreaSelector = selectorFamily({
  key: 'boardSecuritySelfCheckAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).securitySelfCheck;
    },
});

import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardSecurityOpenAreaSelector = selectorFamily({
  key: 'boardSecurityOpenAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).securityOpen;
    },
});

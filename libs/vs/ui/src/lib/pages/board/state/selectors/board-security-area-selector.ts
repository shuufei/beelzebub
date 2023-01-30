import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardSelector } from './board-selector';

export const boardSecurityAreaSelector = selectorFamily({
  key: 'boardSecurityAreaSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardSelector(player)).security;
    },
});

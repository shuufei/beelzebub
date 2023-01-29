import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardsState } from '../boards-state';

export const boardSelector = selectorFamily({
  key: 'boardSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardsState)[player];
    },
});

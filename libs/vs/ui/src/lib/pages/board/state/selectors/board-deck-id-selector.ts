import { Player } from '@beelzebub/vs/domain';
import { selectorFamily } from 'recoil';
import { boardsState } from '../boards-state';

export const boardDeckIdSelector = selectorFamily({
  key: 'boardDeckIdSelector',
  get:
    (player: Player) =>
    ({ get }) => {
      return get(boardsState)[player].deckId;
    },
});

import { BoardState, INITIALI_BOARD_STATE, Player } from '@beelzebub/vs/domain';
import { atom } from 'recoil';

export const boardsState = atom<{ [p in Player]: BoardState }>({
  key: 'boardsState',
  default: {
    me: INITIALI_BOARD_STATE,
    opponent: INITIALI_BOARD_STATE,
  },
});

import { BoardState, INITIALI_BOARD_STATE, Player } from '@beelzebub/vs/domain';
import { atom } from 'recoil';

export type BoardsState = { [p in Player]: BoardState } & {
  memory: {
    player?: Player;
    count: number;
  };
  randomNumber?: number;
};

export const boardsState = atom<BoardsState>({
  key: 'boardsState',
  default: {
    me: INITIALI_BOARD_STATE,
    opponent: INITIALI_BOARD_STATE,
    memory: {
      player: undefined,
      count: 0,
    },
    randomNumber: 0,
  },
});

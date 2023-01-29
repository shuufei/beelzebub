import { User } from '@beelzebub/shared/domain';
import { BoardState, Player } from '@beelzebub/vs/domain';
import { useUser } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { z } from 'zod';
import { boardsState, BoardsState } from './boards-state';
import { dataConnectionState } from './data-connection-state';

export const Action = z.object({
  userId: User.shape.userId,
  actionName: z.string(),
  data: z.any(),
});

type _Action<A, T> = {
  userId: User['userId'];
  actionName: A;
  data: T;
};

export type ChangeMemoryAction = _Action<
  'change-memory',
  {
    player?: Player;
    count: number;
  }
>;

export type DrawAction = _Action<'draw', undefined>;

export type SyncAction = _Action<'sync', BoardState>;

export type Action = ChangeMemoryAction | DrawAction | SyncAction;

const getNewState = (
  player: Player,
  action: Pick<Action, 'actionName' | 'data'>,
  currentState: BoardsState
) => {
  switch (action.actionName) {
    case 'draw': {
      const stack = [...currentState[player].stack];
      const drawCard = stack.shift();
      if (drawCard == null) {
        return currentState;
      }
      const hand = [...currentState[player].hand, drawCard];
      const newBoardState: BoardState = {
        ...currentState[player],
        stack,
        hand,
      };
      return {
        ...currentState,
        [player]: newBoardState,
      };
    }
    case 'sync': {
      return { ...currentState, [player]: action.data };
    }
    case 'change-memory':
    default:
      return currentState;
  }
};

export const useDispatcher = () => {
  const [, setBoards] = useRecoilState(boardsState);
  const connection = useRecoilValue(dataConnectionState);
  const user = useUser();

  const dispatch = useCallback(
    (action: Action) => {
      const player: Player = user?.id === action.userId ? 'me' : 'opponent';
      setBoards((current) => {
        const newState = getNewState(player, action, { ...current });
        return newState;
      });
      console.info(`[DISPATCH] ${player}: ${action.actionName}`);
      if (player === 'me') {
        connection?.send(action);
      }
    },
    [connection, setBoards, user?.id]
  );

  return dispatch;
};

import { Player } from '@beelzebub/vs/domain';
import { useUser } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { boardsState, BoardsState } from '../boards-state';
import { dataConnectionState } from '../data-connection-state';
import {
  Action,
  reducerChangeMemoryAction,
  reducerDrawAction,
  reducerSyncAction,
} from './actions';

const getNewState = (
  player: Player,
  currentState: BoardsState,
  action: Action
) => {
  switch (action.actionName) {
    case 'draw':
      return reducerDrawAction(player, currentState, action.data);
    case 'sync':
      return reducerSyncAction(player, currentState, action.data);
    case 'change-memory':
      return reducerChangeMemoryAction(player, currentState, action.data);
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
      // 新しい状態をcommit
      console.info(`[DISPATCH] ${player}: ${action.actionName}`);
      setBoards((current) => {
        const newState = getNewState(player, { ...current }, action);
        return newState;
      });

      // 自身のactionだった場合、対戦相手に通知する
      if (player === 'me') {
        connection?.send(action);
      }
    },
    [connection, setBoards, user?.id]
  );

  return dispatch;
};

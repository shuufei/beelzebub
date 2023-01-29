import { Player } from '@beelzebub/vs/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { useSendDataToOpponent } from '../../hooks/use-send-data-to-opponent';
import { boardsState, BoardsState } from '../boards-state';
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
  const send = useSendDataToOpponent();

  const dispatch = useCallback(
    (actionPlayer: Player, action: Action) => {
      // 新しい状態をcommit
      console.info(`[DISPATCH] ${actionPlayer}: ${action.actionName}`);
      setBoards((current) => {
        const newState = getNewState(actionPlayer, { ...current }, action);
        return newState;
      });

      // 自身のactionだった場合、対戦相手に通知する
      if (actionPlayer === 'me') {
        send(action);
      }
    },
    [send, setBoards]
  );

  return dispatch;
};

import { Player } from '@beelzebub/vs/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { useSendDataToOpponent } from '../../hooks/use-send-data-to-opponent';
import { boardsState, BoardsState } from '../boards-state';
import {
  Action,
  reducerChangeMemoryAction,
  reducerDrawAction,
  reducerSetDeckAction,
  reducerSyncAction,
} from './actions';
import { reducerAddToEvolutionOriginAction } from './actions/add-to-evolution-origin-action';
import { reducerAllActiveAction } from './actions/all-active-action';
import { reducerChangeCardStateAction } from './actions/change-card-state-action';
import { reducerEvolutionAction } from './actions/evolution-action';
import { reducerSetRandomNumberAction } from './actions/set-random-number-action';
import { reducerMoveAction } from './actions/move-action';
import { reducerMoveToTmpFromEvolutionCardAction } from './actions/move-to-tmp-from-evolution-origin-action';

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
    case 'set-deck':
      return reducerSetDeckAction(player, currentState, action.data);
    case 'move':
      return reducerMoveAction(player, currentState, action.data);
    case 'chagne-card-state':
      return reducerChangeCardStateAction(player, currentState, action.data);
    case 'evolution':
      return reducerEvolutionAction(player, currentState, action.data);
    case 'add-to-evolution-origin':
      return reducerAddToEvolutionOriginAction(
        player,
        currentState,
        action.data
      );
    case 'move-to-tmp-from-evolution-card':
      return reducerMoveToTmpFromEvolutionCardAction(
        player,
        currentState,
        action.data
      );
    case 'all-active':
      return reducerAllActiveAction(player, currentState, action.data);
    case 'set-random-number':
      return reducerSetRandomNumberAction(player, currentState, action.data);
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

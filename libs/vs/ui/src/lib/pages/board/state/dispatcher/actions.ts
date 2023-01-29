import { BoardState, Player } from '@beelzebub/vs/domain';
import { z } from 'zod';
import { BoardsState } from '../boards-state';

export const Action = z.object({
  actionName: z.string(),
  data: z.any(),
});

type _Action<A, T> = {
  actionName: A;
  data: T;
};
type Reducer<T extends _Action<unknown, unknown>> = (
  player: Player,
  currentState: BoardsState,
  data: T['data']
) => BoardsState;

export type ChangeMemoryAction = _Action<
  'change-memory',
  {
    player?: Player;
    count: number;
  }
>;
export const reducerChangeMemoryAction: Reducer<ChangeMemoryAction> = (
  player,
  currentState,
  data
) => {
  return {
    ...currentState,
    memory: {
      player:
        data.player == null
          ? undefined
          : player === data.player
          ? 'me'
          : 'opponent',
      count: data.count,
    },
  };
};

export type DrawAction = _Action<'draw', undefined>;
export const reducerDrawAction: Reducer<DrawAction> = (
  player,
  currentState
) => {
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
};

export type SyncAction = _Action<'sync', BoardState>;
export const reducerSyncAction: Reducer<SyncAction> = (
  player,
  currentState,
  data
) => {
  return { ...currentState, [player]: data };
};

export type Action = ChangeMemoryAction | DrawAction | SyncAction;

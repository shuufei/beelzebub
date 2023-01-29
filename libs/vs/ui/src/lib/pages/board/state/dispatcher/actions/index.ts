import { Player } from '@beelzebub/vs/domain';
import { z } from 'zod';
import { BoardsState } from '../../boards-state';
import type { ChangeMemoryAction } from './change-memory-action';
import type { DrawAction } from './draw-action';
import type { SyncAction } from './sync-action';
import type { SetDeckAction } from './set-deck-action';
export * from './change-memory-action';
export * from './draw-action';
export * from './sync-action';
export * from './set-deck-action';

export const Action = z.object({
  actionName: z.string(),
  data: z.any(),
});

export type _Action<A, T> = {
  actionName: A;
  data: T;
};
export type Reducer<T extends _Action<unknown, unknown>> = (
  player: Player,
  currentState: BoardsState,
  data: T['data']
) => BoardsState;

export type Action =
  | ChangeMemoryAction
  | DrawAction
  | SyncAction
  | SetDeckAction;

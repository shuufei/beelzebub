import { Player } from '@beelzebub/vs/domain';
import { z } from 'zod';
import { BoardsState } from '../../boards-state';
export * from './change-memory-action';
export * from './draw-action';
export * from './set-deck-action';
export * from './sync-action';

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

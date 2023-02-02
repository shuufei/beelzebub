import { AddToEvolutionOriginAction } from './add-to-evolution-origin-action';
import { ChangeCardStateAction } from './change-card-state-action';
import type { ChangeMemoryAction } from './change-memory-action';
import type { DrawAction } from './draw-action';
import { EvolutionAction } from './evolution-action';
import { MoveAction } from './move-action';
import { MoveToTmpFromEvolutionCardAction } from './move-to-tmp-from-evolution-origin-action';
import type { SetDeckAction } from './set-deck-action';
import type { SyncAction } from './sync-action';
export * from './action-type';
export * from './change-memory-action';
export * from './draw-action';
export * from './set-deck-action';
export * from './sync-action';

export type Action =
  | ChangeMemoryAction
  | DrawAction
  | SyncAction
  | SetDeckAction
  | MoveAction
  | ChangeCardStateAction
  | EvolutionAction
  | AddToEvolutionOriginAction
  | MoveToTmpFromEvolutionCardAction;

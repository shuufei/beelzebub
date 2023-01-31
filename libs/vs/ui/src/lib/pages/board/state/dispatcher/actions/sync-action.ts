import { BoardState } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type SyncAction = _Action<'sync', BoardState>;
export const reducerSyncAction: Reducer<SyncAction> = (
  player,
  currentState,
  data
) => {
  return { ...currentState, [player]: data };
};

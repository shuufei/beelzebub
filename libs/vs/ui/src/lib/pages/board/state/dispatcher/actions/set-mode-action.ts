import { BoardsState } from '../../boards-state';
import { Reducer, _Action } from './action-type';

export type SetModeAction = _Action<'set-mode', BoardsState['actionMode']>;
export const reducerSetModeAction: Reducer<SetModeAction> = (
  player,
  currentState,
  data
) => {
  // 相手が自分のstateに対してactionすることはできない
  if (player === 'opponent') {
    return currentState;
  }
  return {
    ...currentState,
    actionMode: data,
  };
};

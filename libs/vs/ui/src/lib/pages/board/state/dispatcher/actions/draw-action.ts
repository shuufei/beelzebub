import { BoardState } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

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

import { BoardArea, BoardCard, BoardState } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type MoveAction = _Action<
  'move',
  {
    card: BoardCard;
    srcArea: BoardArea;
    destArea: BoardArea;
    position: 'top' | 'bottom';
  }
>;
export const reducerMoveAction: Reducer<MoveAction> = (
  player,
  currentState,
  data
) => {
  const srcAreaCards = currentState[player][data.srcArea].filter(
    (v) => v.id !== data.card.id
  );
  const currentDestAreaCards = [...currentState[player][data.destArea]];
  const destAreaCards =
    data.position === 'top'
      ? [data.card, ...currentDestAreaCards]
      : [...currentDestAreaCards, data.card];

  const newBoardState: BoardState = {
    ...currentState[player],
    [data.srcArea]: srcAreaCards,
    [data.destArea]: destAreaCards,
  };
  return {
    ...currentState,
    [player]: newBoardState,
  };
};

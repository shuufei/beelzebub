import { BoardArea, BoardCard, BoardState } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type MoveAction = _Action<
  'move',
  {
    card: BoardCard;
    srcArea: BoardArea;
    destArea: BoardArea;
    position: 'top' | 'bottom';
    withEvolutionOrigins?: boolean;
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
  const addedDestAreaCards = data.withEvolutionOrigins
    ? [data.card, ...data.card.evolutionOriginCards]
    : [data.card];
  const destAreaCards =
    data.position === 'top'
      ? [...addedDestAreaCards, ...currentDestAreaCards]
      : [...currentDestAreaCards, ...addedDestAreaCards];

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

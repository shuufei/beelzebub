import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type ChangeCardStateAction = _Action<
  'chagne-card-state',
  {
    card: BoardCard;
    area: BoardArea;
    newCardState: Partial<BoardCard>;
  }
>;
export const reducerChangeCardStateAction: Reducer<ChangeCardStateAction> = (
  player,
  currentState,
  data
) => {
  const targetCardIndx = currentState[player][data.area].findIndex(
    (v) => v.id === data.card.id
  );
  if (targetCardIndx === -1) {
    return currentState;
  }
  const newCard = {
    ...data.card,
    ...data.newCardState,
  };
  const areaCards = [...currentState[player][data.area]];
  areaCards.splice(targetCardIndx, 1, newCard);
  return {
    ...currentState,
    [player]: {
      ...currentState[player],
      [data.area]: areaCards,
    },
  };
};

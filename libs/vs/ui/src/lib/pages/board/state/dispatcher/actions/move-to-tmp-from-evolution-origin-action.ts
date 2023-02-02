import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type MoveToTmpFromEvolutionCardAction = _Action<
  'move-to-tmp-from-evolution-card',
  {
    card: BoardCard;
    evolutionCard: BoardCard;
    area: BoardArea;
  }
>;
export const reducerMoveToTmpFromEvolutionCardAction: Reducer<
  MoveToTmpFromEvolutionCardAction
> = (player, currentState, data) => {
  const card = { ...data.card };
  card.evolutionOriginCards = card.evolutionOriginCards.filter(
    (v) => v.id !== data.evolutionCard.id
  );
  const areaCards = [...currentState[player][data.area]];
  const replaceTargetIndex = areaCards.findIndex((v) => v.id === card.id);
  areaCards.splice(replaceTargetIndex, 1, card);

  return {
    ...currentState,
    [player]: {
      ...currentState[player],
      [data.area]: areaCards,
      tmp: [...currentState[player].tmp, data.evolutionCard],
    },
  };
};

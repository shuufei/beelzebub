import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type EvolutionAction = _Action<
  'evolution',
  {
    evolutionCard: BoardCard;
    evolutionCardArea: BoardArea;
    evolutionOriginCard: BoardCard;
    evolutionOriginCardArea: BoardArea;
  }
>;
export const reducerEvolutionAction: Reducer<EvolutionAction> = (
  player,
  currentState,
  data
) => {
  const evolutionCard = { ...data.evolutionCard };
  const evolutionOriginCard = { ...data.evolutionOriginCard };
  evolutionCard.evolutionOriginCards = [
    evolutionOriginCard,
    ...evolutionOriginCard.evolutionOriginCards,
  ];
  evolutionOriginCard.evolutionOriginCards = [];
  const destAreaCards = [...currentState[player][data.evolutionOriginCardArea]];
  const replaceTargetIndex = destAreaCards.findIndex(
    (v) => v.id === data.evolutionOriginCard.id
  );
  destAreaCards.splice(replaceTargetIndex, 1, evolutionCard);
  const srcAreaCards = currentState[player][data.evolutionCardArea].filter(
    (v) => v.id !== evolutionCard.id
  );
  return {
    ...currentState,
    [player]: {
      ...currentState[player],
      [data.evolutionCardArea]: srcAreaCards,
      [data.evolutionOriginCardArea]: destAreaCards,
    },
  };
};

import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type AddToEvolutionOriginAction = _Action<
  'add-to-evolution-origin',
  {
    newEvolutionOriginCard: BoardCard;
    newEvolutionOriginCardArea: BoardArea;
    destCard: BoardCard;
    destCardArea: BoardArea;
    addIndex: number;
  }
>;

export const reducerAddToEvolutionOriginAction: Reducer<
  AddToEvolutionOriginAction
> = (player, currentState, data) => {
  // TODO: 挿入位置を指定できるようにする
  const newEvolutionOriginCard = { ...data.newEvolutionOriginCard };
  const destCard = { ...data.destCard };
  destCard.evolutionOriginCards = [
    ...destCard.evolutionOriginCards,
    newEvolutionOriginCard,
    ...newEvolutionOriginCard.evolutionOriginCards,
  ];
  newEvolutionOriginCard.evolutionOriginCards = [];
  const destAreaCards = [...currentState[player][data.destCardArea]];
  const replaceTargetIndex = destAreaCards.findIndex(
    (v) => v.id === destCard.id
  );
  destAreaCards.splice(replaceTargetIndex, 1, destCard);
  const srcAreaCards = currentState[player][
    data.newEvolutionOriginCardArea
  ].filter((v) => v.id !== newEvolutionOriginCard.id);
  return {
    ...currentState,
    [player]: {
      ...currentState[player],
      [data.destCardArea]: destAreaCards,
      [data.newEvolutionOriginCardArea]: srcAreaCards,
    },
  };
};

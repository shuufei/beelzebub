import { BoardArea, BoardCard, BoardState } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type MoveAction = _Action<
  'move',
  {
    card: BoardCard;
    srcArea: BoardArea;
    destArea: BoardArea;
    position: 'top' | 'bottom';
    withOutEvolutionOrigins?: boolean;
  }
>;
export const reducerMoveAction: Reducer<MoveAction> = (
  player,
  currentState,
  data
) => {
  const card = { ...data.card };
  const srcAreaCards = currentState[player][data.srcArea].filter(
    (v) => v.id !== card.id
  );
  const currentDestAreaCards = [...currentState[player][data.destArea]];
  const evolutionOriginCards = [...card.evolutionOriginCards];

  // バトルエリアに移動する場合は、進化元を展開して移動させない
  const noDeployEvolutioinOrigins = data.destArea.startsWith('battle');
  if (!noDeployEvolutioinOrigins) {
    // バトルエリア以外への移動の場合は、進化元を展開した形で移動させるため、進化元を空にする
    card.evolutionOriginCards = [];
  }
  // バトルエリアへの移動でないかつ、明示的に進化元を含める移動の場合は、進化元を移動先エリアで展開する必要がある
  const addedDestAreaCards =
    data.withOutEvolutionOrigins || noDeployEvolutioinOrigins
      ? [card]
      : [card, ...evolutionOriginCards];

  // NOTE: 進化元を含めずに移動する場合は、進化元を元のエリアにとどめる
  if (data.withOutEvolutionOrigins) {
    const shiftted = evolutionOriginCards.shift();
    if (shiftted != null) {
      const srcCardCurrentIndex = currentState[player][data.srcArea].findIndex(
        (v) => v.id === card.id
      );
      const remainedCard = { ...shiftted };
      remainedCard.evolutionOriginCards = [...evolutionOriginCards];
      srcAreaCards.splice(srcCardCurrentIndex, 0, remainedCard);
    }
  }

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

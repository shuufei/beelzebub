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
  // 進化元に追加するカード
  const newEvolutionOriginCard = { ...data.newEvolutionOriginCard };

  // 進化元に追加されるカード
  const destCard = { ...data.destCard };

  destCard.evolutionOriginCards = [...destCard.evolutionOriginCards];
  // 指定位置に進化元カードを追加
  destCard.evolutionOriginCards.splice(
    data.addIndex,
    0,
    ...[newEvolutionOriginCard, ...newEvolutionOriginCard.evolutionOriginCards]
  );

  // 進化元に追加したカードの進化元はリセット
  newEvolutionOriginCard.evolutionOriginCards = [];

  // 進化元を追加したカードに置き換える
  const destAreaCards = [...currentState[player][data.destCardArea]];
  const replaceTargetIndex = destAreaCards.findIndex(
    (v) => v.id === destCard.id
  );
  destAreaCards.splice(replaceTargetIndex, 1, destCard);

  const isSameArea = data.newEvolutionOriginCardArea === data.destCardArea;
  if (isSameArea) {
    // 移動元と移動先のエリアが同じの場合は移動先から素材カードを削除する
    return {
      ...currentState,
      [player]: {
        ...currentState[player],
        // 進化元に追加したカードは、元のエリアからは削除する
        [data.destCardArea]: destAreaCards.filter(
          (v) => v.id !== newEvolutionOriginCard.id
        ),
      },
    };
  } else {
    // 進化元に追加したカードは、元のエリアからは削除する
    const srcAreaCards = currentState[player][
      data.newEvolutionOriginCardArea
    ].filter((v) => v.id !== newEvolutionOriginCard.id);
    return {
      ...currentState,
      [player]: {
        ...currentState[player],
        [data.newEvolutionOriginCardArea]: srcAreaCards,
        [data.destCardArea]: destAreaCards,
      },
    };
  }
};

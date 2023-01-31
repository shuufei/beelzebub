import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

/**
 * 進化元に追加処理を別ファイルに切り出したのちにこのファイルは削除する
 */
export type CommitModeAction = _Action<
  'commit-mode',
  {
    card: BoardCard;
    area: BoardArea;
  }
>;

export const reducerCommitModeAction: Reducer<CommitModeAction> = (
  player,
  currentState,
  data
) => {
  // 相手が自分のstateに対してactionすることはできない
  if (player === 'opponent') {
    return currentState;
  }
  if (currentState.actionMode.trigger == null) {
    return { ...currentState, actionMode: { mode: 'none' } };
  }

  const trigger = currentState.actionMode.trigger;

  switch (currentState.actionMode.mode) {
    case 'addToEvolutionOrigin': {
      // TODO: 挿入位置を指定できるようにする
      const srcArea = trigger.area;
      const destArea = data.area;
      const srcCard = { ...trigger.card };
      const selectedCard = { ...data.card };
      selectedCard.evolutionOriginCards = [
        ...selectedCard.evolutionOriginCards,
        srcCard,
        ...srcCard.evolutionOriginCards,
      ];
      srcCard.evolutionOriginCards = [];
      const destCards = [...currentState.me[destArea]];
      const index = destCards.findIndex((v) => v.id === data.card.id);
      destCards.splice(index, 1, selectedCard);
      const srcCards = currentState.me[srcArea].filter(
        (v) => v.id !== srcCard.id
      );
      console.log('---- ', srcCards, destCards);
      return {
        ...currentState,
        me: {
          ...currentState.me,
          [srcArea]: srcCards,
          [destArea]: destCards,
        },
        actionMode: {
          mode: 'none',
        },
      };
    }
    default:
      return {
        ...currentState,
        actionMode: {
          mode: 'none',
        },
      };
  }
};

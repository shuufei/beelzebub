import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

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
    case 'evolutioin': {
      const srcArea = trigger.area;
      const destArea = data.area;
      const evolutionCard = { ...trigger.card };
      const selectedCard = { ...data.card };
      evolutionCard.evolutionOriginCards = [
        selectedCard,
        ...selectedCard.evolutionOriginCards,
      ];
      selectedCard.evolutionOriginCards = [];
      const destCards = [...currentState.me[destArea]];
      const index = destCards.findIndex((v) => v.id === data.card.id);
      destCards.splice(index, 1, evolutionCard);
      const srcCards = currentState.me[srcArea].filter(
        (v) => v.id !== evolutionCard.id
      );
      return {
        ...currentState,
        me: {
          ...currentState.me,
          [srcArea]: srcCards,
          [destArea]: destCards,
        },
      };
    }
    default:
      return {
        ...currentState,
      };
  }
};

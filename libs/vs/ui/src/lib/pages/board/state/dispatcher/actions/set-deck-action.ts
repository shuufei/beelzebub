import { BoardState, INITIALI_BOARD_STATE } from '@beelzebub/vs/domain';
import { Reducer, _Action } from './action-type';

export type SetDeckAction = _Action<
  'set-deck',
  Pick<BoardState, 'stack' | 'digitamaStack'>
>;

export const reducerSetDeckAction: Reducer<SetDeckAction> = (
  player,
  currentState,
  data
) => {
  return {
    ...currentState,
    [player]: {
      ...INITIALI_BOARD_STATE,
      ...data,
    },
  };
};

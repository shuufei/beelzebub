import { Player } from '@beelzebub/vs/domain';
import { Reducer, _Action } from '.';

export type ChangeMemoryAction = _Action<
  'change-memory',
  {
    player?: Player;
    count: number;
  }
>;
export const reducerChangeMemoryAction: Reducer<ChangeMemoryAction> = (
  player,
  currentState,
  data
) => {
  return {
    ...currentState,
    memory: {
      player:
        data.player == null
          ? undefined
          : player === data.player
          ? 'me'
          : 'opponent',
      count: data.count,
    },
  };
};

import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { atom } from 'recoil';

type _Mode<N, T> = {
  mode: N;
  data: T;
};

export type ActionModeState =
  | _Mode<'none', undefined>
  | _Mode<
      'evolution',
      {
        card: BoardCard;
        area: BoardArea;
      }
    >
  | _Mode<
      'addToEvolutionOrigin',
      {
        card: BoardCard;
        area: BoardArea;
      }
    >;

export const actionModeState = atom<ActionModeState>({
  key: 'actionModeState',
  default: {
    mode: 'none',
    data: undefined,
  },
});

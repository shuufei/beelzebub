import { BoardArea, BoardState } from '@beelzebub/vs/domain';
import { shuffle } from 'lodash';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { boardsState } from '../state/boards-state';
import { useDispatcher } from '../state/dispatcher';

export const useShuffleBoardArea = () => {
  const [boards] = useRecoilState(boardsState);
  const dispatch = useDispatcher();

  const shuffleArea = useCallback(
    (area: BoardArea) => {
      const boardMe = { ...boards.me };

      const cards = [...boardMe[area]];
      const shuffled = shuffle([...cards]);

      const board: BoardState = {
        ...boardMe,
        [area]: shuffled,
      };

      dispatch('me', {
        actionName: 'sync',
        data: board,
      });
    },
    [boards.me, dispatch]
  );

  return shuffleArea;
};

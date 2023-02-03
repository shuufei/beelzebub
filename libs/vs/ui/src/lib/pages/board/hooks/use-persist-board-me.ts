import { BoardState } from '@beelzebub/vs/domain';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { boardsState } from '../state/boards-state';

const KEY = 'board';

export const usePersistBoardMe = () => {
  const [boards, setBoards] = useRecoilState(boardsState);

  useEffect(() => {
    const data = localStorage.getItem(KEY);
    if (data == null) {
      return;
    }
    const currentBoard: BoardState = JSON.parse(data);
    setBoards((current) => {
      return {
        ...current,
        me: currentBoard,
      };
    });
  }, [setBoards]);

  useEffect(() => {
    const serialized = JSON.stringify(boards.me);
    localStorage.setItem(KEY, serialized);
  }, [boards.me]);
};

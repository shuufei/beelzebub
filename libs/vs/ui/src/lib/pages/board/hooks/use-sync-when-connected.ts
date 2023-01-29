import { BoardState, INITIALI_BOARD_STATE } from '@beelzebub/vs/domain';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { dataConnectionState } from '../state/data-connection-state';
import { useDispatcher } from '../state/dispatcher';
import { boardSelector } from '../state/selectors/board-selector';

export const useSyncWhenConnected = () => {
  const boardState = useRecoilValue(boardSelector('me'));
  const boardStateRef = useRef<BoardState>(INITIALI_BOARD_STATE);

  useEffect(() => {
    boardStateRef.current = boardState;
  }, [boardState]);

  const connection = useRecoilValue(dataConnectionState);
  const dispatch = useDispatcher();
  const user = useUser();

  useEffect(() => {
    if (connection == null || user == null) {
      return;
    }
    dispatch({
      userId: user.id,
      actionName: 'sync',
      data: boardStateRef.current,
    });
  }, [connection, dispatch, user]);
};

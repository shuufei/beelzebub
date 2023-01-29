import { BoardState, INITIALI_BOARD_STATE } from '@beelzebub/vs/domain';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { dataConnectionState } from '../state/data-connection-state';
import { boardSelector } from '../state/selectors/board-selector';
import { useSendDataToOpponent } from './use-send-data-to-opponent';

export const useSyncWhenConnected = () => {
  const boardState = useRecoilValue(boardSelector('me'));
  const boardStateRef = useRef<BoardState>(INITIALI_BOARD_STATE);

  useEffect(() => {
    boardStateRef.current = boardState;
  }, [boardState]);

  const connection = useRecoilValue(dataConnectionState);
  const send = useSendDataToOpponent();

  useEffect(() => {
    if (connection == null) {
      return;
    }
    send({
      actionName: 'sync',
      data: boardStateRef.current,
    });
  }, [connection, send]);
};

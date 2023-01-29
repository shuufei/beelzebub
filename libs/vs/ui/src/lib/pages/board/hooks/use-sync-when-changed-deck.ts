import { BoardState, INITIALI_BOARD_STATE } from '@beelzebub/vs/domain';
import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { boardSelector } from '../state/selectors/board-selector';
import { useSendDataToOpponent } from './use-send-data-to-opponent';

export const useSyncWhenChangedDeck = () => {
  const boardState = useRecoilValue(boardSelector('me'));
  const boardStateRef = useRef<BoardState>(INITIALI_BOARD_STATE);

  useEffect(() => {
    boardStateRef.current = boardState;
  }, [boardState]);

  const deckId = useMemo(() => boardState.deckId, [boardState.deckId]);

  const send = useSendDataToOpponent();

  useEffect(() => {
    if (deckId == null) {
      return;
    }
    send({
      actionName: 'sync',
      data: boardStateRef.current,
    });
  }, [deckId, send]);
};

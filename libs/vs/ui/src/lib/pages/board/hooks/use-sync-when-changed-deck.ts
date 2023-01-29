import { BoardState, INITIALI_BOARD_STATE } from '@beelzebub/vs/domain';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useDispatcher } from '../state/dispatcher';
import { boardSelector } from '../state/selectors/board-selector';

export const useSyncWhenChangedDeck = () => {
  const boardState = useRecoilValue(boardSelector('me'));
  const boardStateRef = useRef<BoardState>(INITIALI_BOARD_STATE);

  useEffect(() => {
    boardStateRef.current = boardState;
  }, [boardState]);

  const deckId = useMemo(() => boardState.deckId, [boardState.deckId]);

  const dispatch = useDispatcher();
  const user = useUser();

  useEffect(() => {
    if (deckId == null || user == null) {
      return;
    }
    dispatch({
      userId: user.id,
      actionName: 'sync',
      data: boardStateRef.current,
    });
  }, [deckId, dispatch, user]);
};

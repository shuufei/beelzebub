import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ZodError } from 'zod';
import { boardsState } from '../state/boards-state';
import { dataConnectionState } from '../state/data-connection-state';
import { Action, useDispatcher } from '../state/dispatcher';

export const useSubscribePeerConnection = () => {
  const connection = useRecoilValue(dataConnectionState);
  const [, setBoards] = useRecoilState(boardsState);
  const dispatch = useDispatcher();

  useEffect(() => {
    if (connection == null) {
      return;
    }
    connection.on('data', (action: Action) => {
      try {
        Action.parse(action); // 念の為schema validate
        console.info(
          `[Peer] subscribe action: ${action.userId} ${action.actionName}`
        );
        dispatch(action);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          console.error(error.errors);
        }
        throw error;
      }
    });
  }, [connection, dispatch, setBoards]);
};

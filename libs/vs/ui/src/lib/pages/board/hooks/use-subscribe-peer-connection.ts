import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ZodError } from 'zod';
import { boardsState } from '../state/boards-state';
import { dataConnectionState } from '../state/data-connection-state';
import { useDispatcher } from '../state/dispatcher';
import { Action } from '../state/dispatcher/actions';
import { Action as ActionT } from '../state/dispatcher/actions/action-type';

export const useSubscribePeerConnection = () => {
  const connection = useRecoilValue(dataConnectionState);
  const [, setBoards] = useRecoilState(boardsState);
  const dispatch = useDispatcher();

  useEffect(() => {
    if (connection == null) {
      return;
    }
    const listener = (action: Action) => {
      try {
        ActionT.parse(action); // 念の為schema validate
        console.info(`[Peer] subscribe action: ${action.actionName}`);
        dispatch('opponent', action);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          console.error(error.errors);
        }
        throw error;
      }
    };
    connection.on('data', listener);
    return () => {
      connection.off('data', listener);
    };
  }, [connection, dispatch, setBoards]);
};

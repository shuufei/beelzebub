import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { dataConnectionState } from '../state/data-connection-state';
import { Action } from '../state/dispatcher/actions';

export type SendData = Action;

export const useSendDataToOpponent = () => {
  const connection = useRecoilValue(dataConnectionState);

  const send = useCallback(
    (data: SendData) => {
      connection?.send(data);
    },
    [connection]
  );

  return send;
};

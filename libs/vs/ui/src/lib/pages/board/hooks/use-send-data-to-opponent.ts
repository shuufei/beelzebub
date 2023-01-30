import { useCallback, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { DataConnection } from 'skyway-js';
import { dataConnectionState } from '../state/data-connection-state';
import { Action } from '../state/dispatcher/actions';

export type SendData = Action;

export const useSendDataToOpponent = () => {
  const connection = useRecoilValue(dataConnectionState);
  const connectionRef = useRef<DataConnection | undefined>();

  useEffect(() => {
    connectionRef.current = connection;
  }, [connection]);

  const send = useCallback((data: SendData) => {
    connectionRef.current?.send(data);
  }, []);

  return send;
};

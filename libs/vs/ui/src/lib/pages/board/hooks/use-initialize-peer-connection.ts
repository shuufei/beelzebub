import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Peer from 'skyway-js';
import { dataConnectionState } from '../state/data-connection-state';
import { peerIdState } from '../state/peer-id-state';
import { peerState } from '../state/peer-state';

export const useInitializePeerConnection = (skywayApiKey: string) => {
  const [peer, setPeer] = useRecoilState(peerState);
  const [, setPeerId] = useRecoilState(peerIdState);
  const [, setDataConnection] = useRecoilState(dataConnectionState);

  useEffect(() => {
    setPeer(new Peer({ key: skywayApiKey }));
  }, [setPeer, skywayApiKey]);

  /**
   * NOTE:
   * peerIdをset
   */
  useEffect(() => {
    if (peer == null) {
      return;
    }
    peer.on('open', () => {
      setPeerId(peer.id);
    });
  }, [peer, setPeerId]);

  useEffect(() => {
    if (peer == null) {
      return;
    }
    peer.on('connection', (connection) => {
      connection.once('open', () => {
        console.info('[Peer] connected');
        setDataConnection(connection);
      });
      connection.once('close', () => {
        console.info('[Peer] closed');
        setDataConnection(undefined);
      });
    });
  }, [peer, setDataConnection]);

  const connectRemote = useCallback(
    (remotePeerId: string) => {
      if (peer == null) {
        return;
      }
      const connection = peer.connect(remotePeerId);
      connection.once('open', () => {
        console.info('[Peer] connected');
        setDataConnection(connection);
      });
      connection.once('close', () => {
        console.info('[Peer] closed');
        setDataConnection(undefined);
      });
    },
    [peer, setDataConnection]
  );

  return {
    connectRemote,
  };
};

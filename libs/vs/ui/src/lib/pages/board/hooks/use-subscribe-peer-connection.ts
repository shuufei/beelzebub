import { Deck } from '@beelzebub/shared/domain';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { boardsState } from '../state/boards-state';
import { dataConnectionState } from '../state/data-connection-state';

export const useSubscribePeerConnection = () => {
  const connection = useRecoilValue(dataConnectionState);
  const [, setBoards] = useRecoilState(boardsState);
  useEffect(() => {
    if (connection == null) {
      return;
    }
    connection.on('data', (event: PeerEvent) => {
      console.info('[Peer] subscribe data: ', event);
      // dispatch action
      if (event.action === 'initialize') {
        setBoards((current) => {
          return {
            ...current,
            opponent: {
              ...current.opponent,
              deckId: event.data.deckId,
            },
          };
        });
      }
    });
  }, [connection, setBoards]);
};

type InitializeActionEvent = {
  action: 'initialize';
  data: {
    deckId: Deck['id'];
  };
};

type PeerEvent = InitializeActionEvent;

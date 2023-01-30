import {
  Box,
  Button,
  Heading,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { Board } from './components/board';
import { Memory } from './components/memory';
import { PeerConnectionSetUpAccordion } from './components/peer-connection-accordion';
import { SelectDeckModalDialog } from './components/select-deck-modal-dialog';
import { PlayerContext } from './context/player-context';
import { useSetupBoard } from './hooks/use-setup-board';
import { useSyncWhenConnected } from './hooks/use-sync-when-connected';
import { boardsState } from './state/boards-state';

export type BoardPageProps = {
  skywayApiKey: string;
};

export const BoardPage: FC<BoardPageProps> = ({ skywayApiKey }) => {
  useSyncWhenConnected();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const setupBoard = useSetupBoard();
  const [boards, setBoards] = useRecoilState(boardsState);

  const setup = () => {
    setupBoard();
    return;
  };

  const tmpTrash = () => {
    setBoards((current) => {
      const stack = [...current.me.stack];
      if (stack.length < 4) {
        return current;
      }
      const newTrash = new Array(4).fill(null).reduce((acc) => {
        const card = stack.shift();
        return [...acc, card];
      }, []);
      return {
        ...current,
        me: {
          ...current.me,
          stack,
          trash: [...current.me.trash, ...newTrash],
        },
      };
    });
  };

  const tmpOpenStack = () => {
    setBoards((current) => {
      const stack = [...current.me.stack];
      if (stack.length < 2) {
        return current;
      }
      const newOpen = new Array(2).fill(null).reduce((acc) => {
        const card = stack.shift();
        return [...acc, card];
      }, []);

      return {
        ...current,
        me: {
          ...current.me,
          stack,
          stackOpen: [...current.me.stackOpen, ...newOpen],
        },
      };
    });
  };

  const tmpOpenSecurity = () => {
    setBoards((current) => {
      const security = [...current.me.security];
      if (security.length < 1) {
        return current;
      }

      const newOpenSecurity = new Array(1).fill(null).reduce((acc) => {
        const card = security.shift();
        return [...acc, card];
      }, []);
      return {
        ...current,
        me: {
          ...current.me,
          security,
          securityOpen: [...current.me.securityOpen, ...newOpenSecurity],
        },
      };
    });
  };

  return (
    <>
      <Box as="main">
        <Heading as="h1" hidden>
          battle board
        </Heading>
        <Box p={4}>
          <PeerConnectionSetUpAccordion skywayApiKey={skywayApiKey} />
        </Box>
        <VStack px={8}>
          <PlayerContext.Provider value="opponent">
            <Board />
          </PlayerContext.Provider>

          <HStack justifyContent={'center'} w={'full'}>
            <Memory />
          </HStack>
          <HStack mt={2} justifyContent={'flex-end'} w={'full'}>
            <Button size={'xs'} onClick={onOpen}>
              デッキ選択
            </Button>
            <Button size={'xs'} onClick={setup}>
              対戦セットアップ
            </Button>
            <Button size={'xs'} onClick={tmpTrash}>
              tmp破棄
            </Button>
            <Button size={'xs'} onClick={tmpOpenStack}>
              open stack
            </Button>
            <Button size={'xs'} onClick={tmpOpenSecurity}>
              open security
            </Button>
          </HStack>

          <PlayerContext.Provider value="me">
            <Board />
          </PlayerContext.Provider>
        </VStack>
      </Box>
      <SelectDeckModalDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};

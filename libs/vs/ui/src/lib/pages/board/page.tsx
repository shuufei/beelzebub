import {
  Box,
  Button,
  Heading,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { Board } from './components/board';
import { Memory } from './components/memory';
import { PeerConnectionSetUpAccordion } from './components/peer-connection-accordion';
import { SelectDeckModalDialog } from './components/select-deck-modal-dialog';
import { PlayerContext } from './context/player-context';
import { useSetupBoard } from './hooks/use-setup-board';
import { useSyncWhenConnected } from './hooks/use-sync-when-connected';

export type BoardPageProps = {
  skywayApiKey: string;
};

export const BoardPage: FC<BoardPageProps> = ({ skywayApiKey }) => {
  useSyncWhenConnected();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const setupBoard = useSetupBoard();

  const setup = () => {
    setupBoard();
    return;
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
            <Button size={'sm'} onClick={onOpen}>
              デッキ選択
            </Button>
            <Button size={'sm'} onClick={setup}>
              対戦セットアップ
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

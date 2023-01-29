import {
  Box,
  Button,
  Heading,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Board } from './components/board';
import { Memory } from './components/memory';
import { PeerConnectionSetUpAccordion } from './components/peer-connection-accordion';
import { SelectDeckModalDialog } from './components/select-deck-modal-dialog';
import { PlayerContext } from './context/player-context';
import { useSyncWhenChangedDeck } from './hooks/use-sync-when-changed-deck';
import { useSyncWhenConnected } from './hooks/use-sync-when-connected';
import { boardDeckIdSelector } from './state/selectors/board-deck-id-selector';

export type BoardPageProps = {
  skywayApiKey: string;
};

export const BoardPage: FC<BoardPageProps> = ({ skywayApiKey }) => {
  useSyncWhenConnected();
  useSyncWhenChangedDeck();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const meDeckId = useRecoilValue(boardDeckIdSelector('me'));
  const opponentDeckId = useRecoilValue(boardDeckIdSelector('opponent'));

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
            {opponentDeckId && <Board deckId={opponentDeckId} />}
          </PlayerContext.Provider>

          <HStack justifyContent={'center'} w={'full'}>
            <Memory />
          </HStack>
          <HStack mt={2} justifyContent={'flex-end'} w={'full'}>
            <Button size={'sm'} onClick={onOpen}>
              デッキ選択
            </Button>
          </HStack>

          <PlayerContext.Provider value="me">
            {meDeckId && <Board deckId={meDeckId} />}
          </PlayerContext.Provider>
        </VStack>
      </Box>
      <SelectDeckModalDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};

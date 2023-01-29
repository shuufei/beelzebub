import { Box, Button, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Board } from './components/board';
import { PeerConnectionSetUpAccordion } from './components/peer-connection-accordion';
import { SelectDeckModalDialog } from './components/select-deck-modal-dialog';
import { PlayerContext } from './context/player-context';
import { boardDeckIdSelector } from './state/selectors/board-deck-id-selector';

export type BoardPageProps = {
  skywayApiKey: string;
};

export const BoardPage: FC<BoardPageProps> = ({ skywayApiKey }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const meDeckId = useRecoilValue(boardDeckIdSelector('me'));
  const opponentDeckId = useRecoilValue(boardDeckIdSelector('opponent'));

  return (
    <>
      <Box>
        <Heading as="h1" hidden>
          battle board
        </Heading>
        <Box p={4}>
          <PeerConnectionSetUpAccordion skywayApiKey={skywayApiKey} />
        </Box>
        <PlayerContext.Provider value="opponent">
          {opponentDeckId && <Board deckId={opponentDeckId} />}
        </PlayerContext.Provider>
        <HStack>
          memory
          <Button onClick={onOpen}>デッキ選択</Button>
        </HStack>
        <PlayerContext.Provider value="me">
          {meDeckId && <Board deckId={meDeckId} />}
        </PlayerContext.Provider>
      </Box>
      <SelectDeckModalDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};

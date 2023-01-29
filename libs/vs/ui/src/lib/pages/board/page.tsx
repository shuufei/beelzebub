import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { Board } from './components/board';
import { SelectDeckModalDialog } from './components/select-deck-modal-dialog';
import { PlayerContext } from './context/player-context';

export const BoardPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box>
        <Heading as="h1">battle</Heading>
        <Button onClick={onOpen}>デッキ選択</Button>
        <PlayerContext.Provider value="opponent">
          <Board deckId="3cae3f56-bf43-4525-b421-5274ea91678f" />
        </PlayerContext.Provider>
        memory
        <PlayerContext.Provider value="me">
          <Board deckId="ca5602c2-135d-433f-8580-e81f449054e7" />
        </PlayerContext.Provider>
      </Box>
      <SelectDeckModalDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};

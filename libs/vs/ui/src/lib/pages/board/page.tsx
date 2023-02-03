import { Box, Heading, HStack, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { SWRConfig } from 'swr';
import { Board } from './components/board';
import { BoardSetupMenu } from './components/board-setup-menu';
import { Memory } from './components/memory';
import { PeerConnectionSetUpAccordion } from './components/peer-connection-accordion';
import { PlayerContext } from './context/player-context';
import { usePersistBoardMe } from './hooks/use-persist-board-me';
import { useSyncWhenConnected } from './hooks/use-sync-when-connected';

export type BoardPageProps = {
  skywayApiKey: string;
};

export const BoardPage: FC<BoardPageProps> = ({ skywayApiKey }) => {
  useSyncWhenConnected();
  usePersistBoardMe();

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <Box as="main">
        <Heading as="h1" hidden>
          battle board
        </Heading>
        <Box p={4}>
          <PeerConnectionSetUpAccordion skywayApiKey={skywayApiKey} />
        </Box>
        <VStack px={8} pb={8}>
          <PlayerContext.Provider value="opponent">
            <Board />
          </PlayerContext.Provider>

          <HStack justifyContent={'center'} w={'full'}>
            <Memory />
            <BoardSetupMenu />
          </HStack>

          <PlayerContext.Provider value="me">
            <Board />
          </PlayerContext.Provider>
        </VStack>
      </Box>
    </SWRConfig>
  );
};

import { Box, Button, Heading, HStack, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { Board } from './components/board';
import { BoardSetupMenu } from './components/board-setup-menu';
import { Memory } from './components/memory';
import { PeerConnectionSetUpAccordion } from './components/peer-connection-accordion';
import { PlayerContext } from './context/player-context';
import { useSyncWhenConnected } from './hooks/use-sync-when-connected';
import { actionModeState } from './state/action-mode-state';

export type BoardPageProps = {
  skywayApiKey: string;
};

export const BoardPage: FC<BoardPageProps> = ({ skywayApiKey }) => {
  useSyncWhenConnected();

  const [actionMode, setActionMode] = useRecoilState(actionModeState);

  const cancelActionMode = () => {
    setActionMode({ mode: 'none', data: undefined });
  };

  return (
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
        <HStack mt={2} justifyContent={'center'} w={'full'}>
          {actionMode.mode !== 'none' && (
            <Button size={'xs'} onClick={cancelActionMode}>
              操作キャンセル
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

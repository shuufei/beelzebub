import { Box, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { useInitializeBoard } from '../../hooks/use-initialize-board';
import { boardDeckIdSelector } from '../../state/selectors/board-deck-id-selector';
import { DigitamaStackArea } from './digitama-stack-area';
import { HandArea } from './hand-area';
import { StackArea } from './stack-area';

export const Board: FC = memo(() => {
  const player = useContext(PlayerContext);
  const deckId = useRecoilValue(boardDeckIdSelector(player));
  useInitializeBoard(player, deckId);

  return (
    <VStack
      transform={player === 'opponent' ? 'rotate(180deg)' : ''}
      p={2}
      w={'full'}
      spacing={6}
    >
      <HStack justifyContent={'space-between'} w={'full'}>
        <Box>
          <DigitamaStackArea />
        </Box>
        <Box flex={1}></Box>
        <Box>
          <StackArea />
        </Box>
      </HStack>
      <HandArea />
    </VStack>
  );
});

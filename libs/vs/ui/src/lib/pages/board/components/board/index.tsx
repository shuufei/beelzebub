import { Deck } from '@beelzebub/shared/domain';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { PlayerContext } from '../../context/player-context';
import { useInitializeBoard } from '../../hooks/use-initialize-board';
import { HandArea } from './hand-area';
import { StackArea } from './stack-area';

export const Board: FC<{ deckId: Deck['id'] }> = memo(({ deckId }) => {
  const player = useContext(PlayerContext);
  useInitializeBoard(deckId, player);

  return (
    <VStack
      transform={player === 'opponent' ? 'rotate(180deg)' : ''}
      p={2}
      w={'full'}
      spacing={6}
    >
      <HStack justifyContent={'space-between'} w={'full'}>
        <Box></Box>
        <Box flex={1}></Box>
        <Box>
          <StackArea />
        </Box>
      </HStack>
      <HandArea />
    </VStack>
  );
});

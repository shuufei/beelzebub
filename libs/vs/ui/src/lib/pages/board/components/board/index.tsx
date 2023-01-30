import { Box, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { useInitializeBoard } from '../../hooks/use-initialize-board';
import { boardDeckIdSelector } from '../../state/selectors/board-deck-id-selector';
import { DigitamaStackArea } from './digitama-stack-area';
import { HandArea } from './hand-area';
import { SecurityArea } from './security-area';
import { SecurityOpenArea } from './security-open-area';
import { StackArea } from './stack-area';
import { StackOpenArea } from './stack-open-area';
import { StandbyArea } from './standby-area';
import { TrashArea } from './trash-area';

export const Board: FC = memo(() => {
  const player = useContext(PlayerContext);
  const deckId = useRecoilValue(boardDeckIdSelector(player));
  useInitializeBoard(player, deckId);

  return (
    <VStack
      transform={player === 'opponent' ? 'rotate(180deg)' : ''}
      p={2}
      w={'full'}
      spacing={3}
    >
      <HStack justifyContent={'space-between'} w={'full'}>
        <SecurityOpenArea />
        <StackOpenArea />
      </HStack>
      <HStack
        alignItems={'flex-start'}
        justifyContent={'space-between'}
        w={'full'}
      >
        <VStack spacing={3} alignItems={'center'}>
          <SecurityArea />
          <HStack alignItems={'flex-start'}>
            <DigitamaStackArea />
            <StandbyArea />
          </HStack>
        </VStack>
        <Box flex={1}></Box>
        <VStack spacing={3}>
          <StackArea />
          <TrashArea />
        </VStack>
      </HStack>
      <HandArea />
    </VStack>
  );
});

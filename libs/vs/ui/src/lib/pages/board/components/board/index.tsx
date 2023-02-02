import { Box, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { BoardAreaContext } from '../../context/board-area-context';
import { PlayerContext } from '../../context/player-context';
import { useInitializeBoard } from '../../hooks/use-initialize-board';
import { boardDeckIdSelector } from '../../state/selectors/board-deck-id-selector';
import { BattleArea } from './battle-area';
import { DigitamaStackArea } from './digitama-stack-area';
import { HandArea } from './hand-area';
import { SecurityArea } from './security-area';
import { SecurityOpenArea } from './security-open-area';
import { SecuritySelfCheckArea } from './security-self-check-area';
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
      spacing={4}
    >
      <HStack justifyContent={'space-between'} w={'full'}>
        <BoardAreaContext.Provider value={'securityOpen'}>
          <SecurityOpenArea />
        </BoardAreaContext.Provider>
        <BoardAreaContext.Provider value={'stackOpen'}>
          <StackOpenArea />
        </BoardAreaContext.Provider>
      </HStack>
      <HStack
        alignItems={'flex-start'}
        justifyContent={'space-between'}
        w={'full'}
      >
        <VStack spacing={3} alignItems={'center'}>
          <BoardAreaContext.Provider value={'security'}>
            <SecurityArea />
          </BoardAreaContext.Provider>
          <HStack alignItems={'flex-start'}>
            <BoardAreaContext.Provider value={'digitamaStack'}>
              <DigitamaStackArea />
            </BoardAreaContext.Provider>
            <BoardAreaContext.Provider value={'standby'}>
              <StandbyArea />
            </BoardAreaContext.Provider>
          </HStack>
        </VStack>

        <Box>
          <BattleArea />
        </Box>

        <VStack spacing={3}>
          <BoardAreaContext.Provider value={'stack'}>
            <StackArea />
          </BoardAreaContext.Provider>
          <BoardAreaContext.Provider value={'trash'}>
            <TrashArea />
          </BoardAreaContext.Provider>
        </VStack>
      </HStack>
      <HandArea />
      <SecuritySelfCheckArea />
    </VStack>
  );
});

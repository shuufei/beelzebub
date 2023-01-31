import { VStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { BoardAreaContext } from '../../context/board-area-context';
import { BattleDigimonArea } from './battle-digimon-area';
import { BattleOptionArea } from './battle-option-area';
import { BattleTamerArea } from './battle-tamer-area';

export const BattleArea: FC = memo(() => {
  return (
    <VStack spacing={6} alignItems={'flex-start'} px={3} w={'full'}>
      <BoardAreaContext.Provider value={'battleDigimon'}>
        <BattleDigimonArea />
      </BoardAreaContext.Provider>
      <BoardAreaContext.Provider value={'battleTamer'}>
        <BattleTamerArea />
      </BoardAreaContext.Provider>
      <BoardAreaContext.Provider value={'battleOption'}>
        <BattleOptionArea />
      </BoardAreaContext.Provider>
    </VStack>
  );
});

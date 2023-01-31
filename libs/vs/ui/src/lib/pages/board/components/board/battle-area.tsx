import { VStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { BattleDigimonArea } from './battle-digimon-area';
import { BattleOptionArea } from './battle-option-area';
import { BattleTamerArea } from './battle-tamer-area';

export const BattleArea: FC = memo(() => {
  return (
    <VStack spacing={6} alignItems={'flex-start'} px={3} w={'full'}>
      <BattleDigimonArea />
      <BattleTamerArea />
      <BattleOptionArea />
    </VStack>
  );
});

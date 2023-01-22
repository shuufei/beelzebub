import { Button, HStack, VStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { CardTypeFilter } from './card-type-filter';
import { CategoryFilter } from './category-filter';
import { ColorsFilter } from './colors-filter';
import { IncludeParallelFilter } from './include-parallel-filter';
import { LvFilter } from './lv-filter';

export const CardsFilter: FC<{
  onExecuteFilter: () => void;
}> = memo(({ onExecuteFilter }) => {
  return (
    <VStack alignItems={'flex-start'}>
      <HStack alignItems={'center'}>
        <CategoryFilter />
        <ColorsFilter />
        <LvFilter />
        <CardTypeFilter />
        <IncludeParallelFilter />
      </HStack>
      <Button size={'sm'} colorScheme={'blue'} onClick={onExecuteFilter}>
        再検索
      </Button>
    </VStack>
  );
});

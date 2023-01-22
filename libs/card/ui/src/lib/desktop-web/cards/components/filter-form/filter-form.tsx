import { Button, HStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { CardTypeFilter } from './card-type-filter';
import { CategoryFilter } from './category-filter';
import { ColorsFilter } from './colors-filter';
import { IncludeParallelFilter } from './include-parallel-filter';
import { LvFilter } from './lv-filter';

export const FilterForm: FC<{
  onExecuteFilter: () => void;
}> = memo(({ onExecuteFilter }) => {
  return (
    <HStack alignItems={'flex-start'}>
      <ColorsFilter />
      <LvFilter />
      <CardTypeFilter />
      <IncludeParallelFilter />
      <CategoryFilter />
      <Button onClick={onExecuteFilter}>再検索</Button>
    </HStack>
  );
});

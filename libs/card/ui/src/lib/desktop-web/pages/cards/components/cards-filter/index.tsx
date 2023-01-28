import { Button, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import {
  CardTypeCondition,
  ColorsCondition,
  filterConditionState,
  LvCondition,
} from '../../state/filter-conditions';
import { CardTypeFilter } from './card-type-filter';
import { CategoryFilter } from './category-filter';
import { ColorsFilter } from './colors-filter';
import { IncludeParallelFilter } from './include-parallel-filter';
import { LvFilter } from './lv-filter';
import { NameFilter } from './name-filter';

export const CardsFilter: FC<{
  onExecuteFilter: () => void;
}> = memo(({ onExecuteFilter }) => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);

  const resetFilter = useCallback(() => {
    setFilterCondition((current) => {
      const resetCondition = (condition: { [key: string]: boolean }) =>
        Object.keys(condition).reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: true,
          };
        }, {});
      return {
        category: resetCondition(current.category),
        color: resetCondition(current.color) as ColorsCondition,
        lv: resetCondition(current.lv) as LvCondition,
        cardType: resetCondition(current.cardType) as CardTypeCondition,
        includeParallel: true,
        name: '',
      };
    });
    onExecuteFilter();
  }, [onExecuteFilter, setFilterCondition]);

  return (
    <VStack alignItems={'flex-start'} spacing={2}>
      <HStack alignItems={'center'}>
        <NameFilter />
        <CategoryFilter />
        <ColorsFilter />
        <LvFilter />
        <CardTypeFilter />
        <IncludeParallelFilter />
      </HStack>
      <HStack>
        <Button size={'sm'} colorScheme={'blue'} onClick={onExecuteFilter}>
          再検索
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          colorScheme={'blue'}
          onClick={resetFilter}
        >
          リセット
        </Button>
      </HStack>
    </VStack>
  );
});

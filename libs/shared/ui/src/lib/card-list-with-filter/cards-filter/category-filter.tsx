import { useGetCategories } from '@beelzebub/shared/db';
import { Checkbox, HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { FC, memo, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  CategoryCondition,
  categoryFilterConditionState,
  filterConditionState,
} from '../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';
import { FilterPopup } from './filter-popup';

export const CategoryFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(categoryFilterConditionState);
  const { data: categories } = useGetCategories();

  useEffect(() => {
    if (categories == null) {
      return;
    }
    setFilterCondition((current) => {
      const categoryCondition: CategoryCondition = categories.reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr.id]: true,
          };
        },
        {}
      );
      return {
        ...current,
        category: categoryCondition,
      };
    });
  }, [categories, setFilterCondition]);

  const conditionString = useMemo(() => {
    return `${Object.entries(condition)
      .filter(([, value]) => value)
      .map(([key]) => {
        return categories?.find((v) => v.id === key)?.categoryName ?? '';
      })
      .join(', ')}`;
  }, [condition, categories]);

  if (categories == null) {
    return <Spinner />;
  }

  return (
    <FilterPopup
      triggerButtonLabel={`カテゴリ: ${conditionString}`}
      header={
        <HStack justifyContent={'space-between'}>
          <Text fontSize={'sm'} fontWeight={'semibold'}>
            カテゴリ
          </Text>
          <HStack pr={'6'}>
            <AllCheckButton filterKey={'category'} />
            <AllUncheckButton filterKey={'category'} />
          </HStack>
        </HStack>
      }
      body={
        <Stack>
          {categories.map((category) => {
            return (
              <Checkbox
                key={category.id}
                isChecked={condition[category.id]}
                onChange={() => {
                  const newCondition = {
                    ...condition,
                  };
                  newCondition[category.id] = !newCondition[category.id];
                  setFilterCondition((current) => {
                    return {
                      ...current,
                      category: newCondition,
                    };
                  });
                }}
              >
                <Text fontSize={'sm'}>{category.categoryName}</Text>
              </Checkbox>
            );
          })}
        </Stack>
      }
    />
  );
});

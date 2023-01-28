import { CategoryDB, convertToCategory } from '@beelzebub/shared/db';
import { Checkbox, HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FC, memo, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { z } from 'zod';
import {
  CategoryCondition,
  categoryFilterConditionState,
  filterConditionState,
} from '../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';
import { FilterPopup } from './filter-popup';

const useGetCategories = () => {
  const supabaseClient = useSupabaseClient();
  const { data } = useSWR('/supabase/db/categories', async () => {
    const result = await supabaseClient
      .from('categories')
      .select()
      .order('category_name', { ascending: true });
    if (result.error != null) {
      throw new Error(
        `failed select categories: ${JSON.stringify(result.error)}`
      );
    }
    const categories = z.array(CategoryDB).parse(result.data);
    const convertedCategories = categories.map(convertToCategory);
    return { categories: convertedCategories };
  });
  return { categories: data?.categories };
};

export const CategoryFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(categoryFilterConditionState);
  const { categories } = useGetCategories();

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

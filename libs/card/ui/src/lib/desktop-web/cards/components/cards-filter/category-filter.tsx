import { CategoryDB } from '@beelzebub/shared/db';
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
} from '../../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';
import { FilterPopup } from './filter-popup';

export const CategoryFilter: FC = memo(() => {
  const supabaseClient = useSupabaseClient();
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(categoryFilterConditionState);
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
    return { categories };
  });

  useEffect(() => {
    if (data?.categories == null) {
      return;
    }
    setFilterCondition((current) => {
      const categoryCondition: CategoryCondition = data.categories.reduce(
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
  }, [data?.categories, setFilterCondition]);

  const conditionString = useMemo(() => {
    return `${Object.entries(condition)
      .filter(([, value]) => value)
      .map(([key]) => {
        return data?.categories.find((v) => v.id === key)?.category_name ?? '';
      })
      .join(', ')}`;
  }, [condition, data?.categories]);

  if (data == null) {
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
          {data.categories.map((category) => {
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
                <Text fontSize={'sm'}>{category.category_name}</Text>
              </Checkbox>
            );
          })}
        </Stack>
      }
    />
  );
});

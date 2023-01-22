import { GetCategoriesResponseBody } from '@beelzebub/card/api';
import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { FC, memo, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { fetcher } from '../../libs/fetcher';
import {
  CategoryCondition,
  categoryFilterConditionState,
  filterConditionState,
} from '../../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';

export const CategoryFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(categoryFilterConditionState);
  const { data } = useSWR<GetCategoriesResponseBody>(
    '/api/categories',
    fetcher
  );

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

  if (data == null) {
    return <Spinner />;
  }

  return (
    <FormControl>
      <FormLabel>カテゴリ</FormLabel>
      <HStack>
        <AllCheckButton filterKey={'category'} />
        <AllUncheckButton filterKey={'category'} />
      </HStack>
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
              {category.categoryName}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
});

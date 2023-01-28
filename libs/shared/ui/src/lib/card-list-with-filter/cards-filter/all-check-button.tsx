import { Button } from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import {
  ColorsCondition,
  FilterCondition,
  filterConditionState,
} from '../state/filter-conditions';

export const AllCheckButton: FC<{ filterKey: keyof FilterCondition }> = ({
  filterKey,
}) => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  return (
    <Button
      size={'xs'}
      onClick={() => {
        setFilterCondition((current) => {
          return {
            ...current,
            [filterKey]: Object.keys(current[filterKey]).reduce((acc, curr) => {
              return {
                ...acc,
                [curr]: true,
              };
            }, {} as ColorsCondition),
          };
        });
      }}
    >
      {'全選択'}
    </Button>
  );
};

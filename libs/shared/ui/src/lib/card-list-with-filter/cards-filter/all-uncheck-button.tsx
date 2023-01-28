import { Button } from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import {
  ColorsCondition,
  FilterCondition,
  filterConditionState,
} from '../state/filter-conditions';

export const AllUncheckButton: FC<{ filterKey: keyof FilterCondition }> = ({
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
                [curr]: false,
              };
            }, {} as ColorsCondition),
          };
        });
      }}
    >
      {'全解除'}
    </Button>
  );
};

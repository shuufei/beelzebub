import {
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FC, memo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  filterConditionState,
  includeParallelConditionState,
} from '../../state/filter-conditions';

export const IncludeParallelFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(includeParallelConditionState);
  return (
    <Checkbox
      isChecked={condition}
      onChange={() => {
        setFilterCondition((current) => {
          return {
            ...current,
            includeParallel: !current.includeParallel,
          };
        });
      }}
    >
      <Text fontSize={'sm'} whiteSpace={'nowrap'}>
        パラレル
      </Text>
    </Checkbox>
  );
});

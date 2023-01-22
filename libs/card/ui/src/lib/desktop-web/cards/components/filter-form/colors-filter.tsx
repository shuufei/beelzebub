import { Color } from '@beelzebub/shared/domain';
import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { FC, memo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  colorFilterConditionState,
  filterConditionState,
} from '../../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';

const COLORS: Color[] = [
  'red',
  'blue',
  'green',
  'yellow',
  'black',
  'purple',
  'white',
];

export const ColorsFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(colorFilterConditionState);
  return (
    <FormControl>
      <FormLabel>色</FormLabel>
      <HStack>
        <AllCheckButton filterKey={'color'} />
        <AllUncheckButton filterKey={'color'} />
      </HStack>
      <Stack>
        {COLORS.map((color) => {
          return (
            <Checkbox
              key={color}
              isChecked={condition[color]}
              onChange={() => {
                const newCondition = {
                  ...condition,
                };
                newCondition[color] = !newCondition[color];
                setFilterCondition((current) => {
                  return {
                    ...current,
                    color: newCondition,
                  };
                });
              }}
            >
              {color}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
});

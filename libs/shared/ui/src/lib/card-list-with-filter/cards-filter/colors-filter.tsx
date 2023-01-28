import { Color } from '@beelzebub/shared/domain';
import { Checkbox, HStack, Stack, Text } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  colorFilterConditionState,
  filterConditionState,
} from '../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';
import { FilterPopup } from './filter-popup';

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
    <FilterPopup
      triggerButtonLabel={`色: ${Object.entries(condition)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ')}`}
      header={
        <HStack justifyContent={'space-between'}>
          <Text fontSize={'sm'} fontWeight={'semibold'}>
            色
          </Text>
          <HStack pr={'6'}>
            <AllCheckButton filterKey={'color'} />
            <AllUncheckButton filterKey={'color'} />
          </HStack>
        </HStack>
      }
      body={
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
                <Text fontSize={'sm'}>{color}</Text>
              </Checkbox>
            );
          })}
        </Stack>
      }
    />
  );
});

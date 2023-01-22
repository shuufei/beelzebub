import { Lv } from '@beelzebub/shared/domain';
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
  filterConditionState,
  lvFilterConditionState,
} from '../../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';

const LV_LIST: Lv[] = ['-', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6', 'Lv.7'];

export const LvFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(lvFilterConditionState);
  return (
    <FormControl>
      <FormLabel>Lv</FormLabel>
      <HStack>
        <AllCheckButton filterKey={'lv'} />
        <AllUncheckButton filterKey={'lv'} />
      </HStack>
      <Stack>
        {LV_LIST.map((lv) => {
          return (
            <Checkbox
              key={lv}
              isChecked={condition[lv]}
              onChange={() => {
                const newCondition = {
                  ...condition,
                };
                newCondition[lv] = !newCondition[lv];
                setFilterCondition((current) => {
                  return {
                    ...current,
                    lv: newCondition,
                  };
                });
              }}
            >
              {lv}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
});

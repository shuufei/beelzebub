import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { filterConditionState } from '../state/filter-conditions';

export const NameFilter: FC = () => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  return (
    <FormControl maxWidth={'48'}>
      <FormLabel fontSize={'xs'} mb={0} hidden>
        name
      </FormLabel>
      <Input
        type={'text'}
        size={'sm'}
        mt={0}
        placeholder={'name'}
        onChange={(event) => {
          const name = event.target.value;
          setFilterCondition((current) => {
            return {
              ...current,
              name,
            };
          });
        }}
      />
    </FormControl>
  );
};

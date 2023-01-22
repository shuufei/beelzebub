import { CardType } from '@beelzebub/shared/domain';
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
  cardTypeFilterConditionState,
  filterConditionState,
} from '../../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';

const CARD_TYPE_LIST: CardType[] = [
  'デジモン',
  'デジタマ',
  'テイマー',
  'オプション',
];

export const CardTypeFilter: FC = memo(() => {
  const [, setFilterCondition] = useRecoilState(filterConditionState);
  const condition = useRecoilValue(cardTypeFilterConditionState);
  return (
    <FormControl>
      <FormLabel>カードタイプ</FormLabel>
      <HStack>
        <AllCheckButton filterKey={'cardType'} />
        <AllUncheckButton filterKey={'cardType'} />
      </HStack>
      <Stack>
        {CARD_TYPE_LIST.map((cardType) => {
          return (
            <Checkbox
              key={cardType}
              isChecked={condition[cardType]}
              onChange={() => {
                const newCondition = {
                  ...condition,
                };
                newCondition[cardType] = !newCondition[cardType];
                setFilterCondition((current) => {
                  return {
                    ...current,
                    cardType: newCondition,
                  };
                });
              }}
            >
              {cardType}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
});

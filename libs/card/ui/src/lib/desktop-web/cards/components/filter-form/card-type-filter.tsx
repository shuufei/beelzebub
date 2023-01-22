import { CardType } from '@beelzebub/shared/domain';
import { Checkbox, HStack, Stack, Text } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  cardTypeFilterConditionState,
  filterConditionState,
} from '../../state/filter-conditions';
import { AllCheckButton } from './all-check-button';
import { AllUncheckButton } from './all-uncheck-button';
import { FilterPopup } from './filter-popup';

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
    <FilterPopup
      triggerButtonLabel={`カードタイプ: ${Object.entries(condition)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ')}`}
      header={
        <HStack justifyContent={'space-between'}>
          <Text>カードタイプ</Text>
          <HStack pr={'6'}>
            <AllCheckButton filterKey={'cardType'} />
            <AllUncheckButton filterKey={'cardType'} />
          </HStack>
        </HStack>
      }
      body={
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
      }
    />
  );
});

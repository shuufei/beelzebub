import { DeckVersion } from '@beelzebub/shared/domain';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import d from 'dayjs';
import { FC } from 'react';

export const DeckVersionCard: FC<{
  deckVersion: DeckVersion;
  isSelected?: boolean;
  onPreview?: () => void;
}> = ({ deckVersion, isSelected = false, onPreview }) => {
  return (
    <VStack
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      spacing={4}
      rounded={'sm'}
      pl={3}
      pr={6}
      pt={2}
      pb={4}
      border={'2px'}
      borderColor={isSelected ? 'gray.700' : 'gray.100'}
    >
      <VStack fontSize={'xs'} alignItems={'flex-start'} spacing={1}>
        <Text fontWeight={'semibold'}>
          {d(deckVersion.createdAt).format('YYYY年MM月D日 HH時mm分')}
        </Text>
        <Text>{deckVersion.comment}</Text>
      </VStack>
      <HStack alignItems={'flex-end'} spacing={1.5}>
        <Button
          size={'xs'}
          colorScheme={'blue'}
          variant={'outline'}
          disabled={isSelected}
          onClick={onPreview}
        >
          表示
        </Button>
        <Button size={'xs'} colorScheme={'blue'} variant={'outline'}>
          復元
        </Button>
      </HStack>
    </VStack>
  );
};

import { DeckJoinedLatestDeckVersion } from '@beelzebub/deck/domain';
import { useGetUsers } from '@beelzebub/shared/db';
import { KeyCardImg } from '@beelzebub/shared/ui';
import { Box, Button, HStack, Text, useDisclosure } from '@chakra-ui/react';
import d from 'dayjs';
import { FC, memo } from 'react';
import { DeckCardListModalDialog } from './deck-card-list-modal-dialog';

export const DeckItem: FC<{
  deck: DeckJoinedLatestDeckVersion;
  onSelect: () => void;
}> = memo(({ deck, onSelect }) => {
  const { data: users } = useGetUsers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <HStack
        alignItems={'flex-start'}
        justifyContent={'space-between'}
        w={'full'}
        p={2}
        borderRadius={'sm'}
      >
        <HStack alignItems={'flex-start'}>
          <KeyCardImg keyCard={deck.keyCard} width={50} />
          <Box alignItems={'flex-start'}>
            <Text
              noOfLines={1}
              fontSize={'sm'}
              mt={0.5}
              fontWeight={'semibold'}
            >
              {deck.name}
            </Text>
            <Text noOfLines={1} fontSize={'xs'}>
              @
              {users?.find((v) => v.userId === deck.userId)?.name ??
                deck.userId}
            </Text>
            <Text color={'gray.600'} fontSize={'xs'}>
              {d(deck.latestDeckVersion.createdAt).format(
                'YYYY年MM月DD日 HH時mm分'
              )}
            </Text>
            <Button size={'xs'} variant={'outline'} mt={1} onClick={onOpen}>
              カードリスト確認
            </Button>
          </Box>
        </HStack>
        <Button size={'sm'} onClick={onSelect}>
          選択
        </Button>
      </HStack>
      {isOpen && (
        <DeckCardListModalDialog
          isOpen={isOpen}
          cards={deck.latestDeckVersion.cards ?? []}
          onClose={onClose}
        />
      )}
    </>
  );
});

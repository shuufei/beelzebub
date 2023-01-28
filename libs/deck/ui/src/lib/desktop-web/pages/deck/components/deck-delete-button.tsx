import { useDeleteDeckById } from '@beelzebub/deck/db';
import { Deck } from '@beelzebub/shared/domain';
import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, memo, useCallback } from 'react';

export const DeckDeleteButton: FC<{
  deckId: Deck['id'];
  onDeleted?: () => void;
}> = memo(({ deckId, onDeleted }) => {
  const router = useRouter();
  const deleteDeckById = useDeleteDeckById();

  const deleteDeck = useCallback(async () => {
    deleteDeckById(deckId);
    router.push('/decks');
    onDeleted?.();
    return;
  }, [deckId, deleteDeckById, onDeleted, router]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme={'red'} variant={'outline'} size={'sm'} mt={3}>
          デッキ削除
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader
          color={'red.500'}
          fontSize={'sm'}
          fontWeight={'semibold'}
        >
          デッキ削除
        </PopoverHeader>
        <PopoverBody fontSize={'sm'}>
          <Text>デッキを削除しますか？</Text>
          <Text>この操作は取り消せません。</Text>
          <HStack mt={3}>
            <Button
              colorScheme={'red'}
              variant={'solid'}
              size={'sm'}
              onClick={deleteDeck}
            >
              削除
            </Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

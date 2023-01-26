import { Deck } from '@beelzebub/shared/domain';
import {
  Text,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  HStack,
} from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { FC, memo, useCallback } from 'react';

export const DeckDeleteButton: FC<{
  deckId: Deck['id'];
  onDeleted?: () => void;
}> = memo(({ deckId, onDeleted }) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const deleteDeck = useCallback(async () => {
    if (user == null) {
      return;
    }
    await supabaseClient.from('deck_versions').delete().eq('deck_id', deckId);
    await supabaseClient.from('decks').delete().eq('id', deckId);
    router.push('/decks');
    onDeleted?.();
    return;
  }, [deckId, onDeleted, router, supabaseClient, user]);

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

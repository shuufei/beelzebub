import { useGetDeckJoinLatestDeckVersion } from '@beelzebub/deck/db';
import { Deck } from '@beelzebub/shared/domain';
import {
  CardCustomButtonContext,
  CardListWithFilter,
} from '@beelzebub/shared/ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';
import { DeckCardList } from './components/deck-card-list';
import { useAddRemoveDeckCard } from './hooks/use-add-remove-deck-card';
import { useSaveDeckVersion } from './hooks/use-save-deck-version';

export type DeckEditPageProps = {
  deckId: Deck['id'];
};

export const DeckEditPage: FC<DeckEditPageProps> = ({ deckId }) => {
  const user = useUser();
  const { data: deck } = useGetDeckJoinLatestDeckVersion(deckId);
  const { addDeckCard } = useAddRemoveDeckCard();
  const saveDeckVersion = useSaveDeckVersion();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const save = useCallback(async () => {
    if (user?.id !== deck?.userId) {
      throw new Error('Permission Denied');
    }
    setLoading(true);
    await saveDeckVersion(deckId);
    toast({
      title: 'デッキのカードリストを更新しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
    setLoading(false);
    router.push(`/decks/${deckId}`);
  }, [deck?.userId, deckId, router, saveDeckVersion, toast, user?.id]);

  return (
    <Box as="main" pb="8">
      <HStack
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'blue.600'}
        px={2}
        py={1.5}
      >
        <Box>
          <Link href={`/decks/${deckId}`}>
            <Button
              size={'sm'}
              variant={'ghost'}
              leftIcon={<ArrowBackIcon />}
              colorScheme={'gray'}
              color={'white'}
              _hover={{ bg: 'transparent' }}
            >
              戻る
            </Button>
          </Link>
        </Box>
        <Heading
          as="h1"
          fontSize={'sm'}
          mt={2}
          color={'white'}
          flex={1}
          textAlign={'center'}
        >
          デッキ編集
        </Heading>
        <Box>
          <Button size={'sm'} onClick={save} disabled={isLoading}>
            {!isLoading ? '保存' : <Spinner size={'sm'} />}
          </Button>
        </Box>
      </HStack>

      <HStack alignItems={'flex-start'} mt={4} px={4}>
        <Box flex={1}>
          <CardCustomButtonContext.Provider
            value={{
              label: '追加',
              onClick: (card) => {
                addDeckCard(card);
              },
            }}
          >
            <CardListWithFilter />
          </CardCustomButtonContext.Provider>
        </Box>
        <Box
          pt={'3rem'}
          pb={12}
          w={'18rem'}
          h={'100vh'}
          position={'sticky'}
          top={0}
          overflow={'auto'}
        >
          {deck && <DeckCardList deck={deck} />}
        </Box>
      </HStack>
    </Box>
  );
};

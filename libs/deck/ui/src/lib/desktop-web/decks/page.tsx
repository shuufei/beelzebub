import {
  convertToDeck,
  convertToDeckVersion,
  DeckDBJoinedDeckVersionsDB,
  DeckVersionDB,
} from '@beelzebub/shared/db';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { FC } from 'react';
import useSWR from 'swr';
import { v4 } from 'uuid';
import { z } from 'zod';
import { CreateDeckModalDialog } from './components/create-deck-modal-dialog';
import { DeckCard } from './components/deck-card';
import { DeckJoinedLatestDeckVersion } from './domain/deck-joined-latest-deck-version';

const useGetDecksJoinLatestDeckVersion = () => {
  const supabaseClient = useSupabaseClient();
  const { data, mutate } = useSWR('/supabase/db/me/decks', async () => {
    const { data } = await supabaseClient
      .from('decks')
      .select(
        `
          *,
          deck_versions:id ( * )
        `
      )
      .order('created_at', { ascending: false, foreignTable: 'deck_versions' })
      .limit(1, { foreignTable: 'deck_versions' });
    const parsed = z.array(DeckDBJoinedDeckVersionsDB).safeParse(data);
    if (!parsed.success) {
      console.error(
        '[ERROR] parse error decks joined deck_versions: ',
        parsed.error
      );
      return undefined;
    }
    const response: DeckJoinedLatestDeckVersion[] = parsed.data.map((v) => {
      const latest: DeckVersionDB | undefined = v.deck_versions[0];
      const deck = convertToDeck({
        id: v.id,
        created_at: v.created_at,
        user_id: v.user_id,
        public: v.public,
        name: v.name,
        key_card: v.key_card,
      });
      return {
        ...deck,
        latestDeckVersion: convertToDeckVersion(
          latest ?? {
            id: v4(),
            created_at: new Date().toISOString(),
            deck_id: v.id,
            name: 'placeholder',
            cards: [],
            adjustment_cards: [],
            user_id: v.user_id,
          }
        ),
      };
    });
    return response;
  });
  return { data, mutate };
};

export const DecksPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: decks, mutate } = useGetDecksJoinLatestDeckVersion();

  return (
    <>
      <Box as="main" px="6" pt="4" pb="8">
        <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <Heading as="h1" fontSize={'lg'}>
            デッキリスト
          </Heading>

          <Button
            variant={'ghost'}
            mt={3}
            onClick={onOpen}
            colorScheme={'blue'}
            size={'sm'}
            leftIcon={<AddIcon />}
          >
            新規作成
          </Button>
        </HStack>

        {decks?.length === 0 ?? <Text>デッキが登録されていません</Text>}
        <VStack alignItems={'flex-start'} width={'full'} mt={6}>
          {decks?.map((deck) => {
            return (
              <Box width={'full'} key={deck.id}>
                <Link href={`/decks/${deck.id}`}>
                  <DeckCard deck={deck} />
                </Link>
              </Box>
            );
          })}
        </VStack>
      </Box>
      <CreateDeckModalDialog
        isOpen={isOpen}
        onClose={() => {
          onClose();
          mutate();
        }}
      />
    </>
  );
};

import {
  convertToDeck,
  convertToDeckVersion,
  DeckDB,
  DeckDBJoinedDeckVersionsDB,
  DeckVersionDB,
} from '@beelzebub/shared/db';
import { Deck, DeckVersion } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { FC, useCallback } from 'react';
import useSWR from 'swr';
import { v4 } from 'uuid';
import { z } from 'zod';

type DeckJoinedLatestDeckVersion = Deck & {
  latestDeckVersion: DeckVersion;
};

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
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const { data: decks, mutate } = useGetDecksJoinLatestDeckVersion();

  const createDeck = useCallback(async () => {
    if (user == null) {
      return;
    }
    const id = v4();
    const deck: Omit<DeckDB, 'created_at'> = {
      id,
      name: `deck name ${id}`,
      user_id: user.id,
      public: true,
      key_card: {
        img_file_name: 'BT9-033.png',
        category_id: '503011',
      },
    };
    const deckVersions: Omit<DeckVersionDB, 'created_at'> = {
      id: v4(),
      deck_id: deck.id,
      cards: [
        {
          img_file_name: 'BT9-033.png',
          category_id: '503011',
          count: 4,
        },
      ],
      adjustment_cards: [],
      user_id: user.id,
    };
    await supabaseClient.from('decks').insert({ ...deck });
    await supabaseClient.from('deck_versions').insert({ ...deckVersions });
    mutate();
    return;
  }, [mutate, supabaseClient, user]);

  const updateDeck = useCallback(
    async (id: Deck['id'], isPublic: boolean) => {
      if (user == null) {
        return;
      }
      await supabaseClient
        .from('decks')
        .update({ public: isPublic })
        .eq('id', id);
      mutate();
      return;
    },
    [mutate, supabaseClient, user]
  );
  const deleteDeck = useCallback(
    async (id: Deck['id']) => {
      if (user == null) {
        return;
      }
      await supabaseClient.from('decks').delete().eq('id', id);
      mutate();
      return;
    },
    [mutate, supabaseClient, user]
  );

  return (
    <Box as="main" px="6" pt="4" pb="8">
      <Heading as="h1" fontSize={'lg'}>
        デッキリスト
      </Heading>

      <Button mt={3} onClick={createDeck}>
        新規作成
      </Button>

      {decks?.length ?? 0}
      {decks?.map((deck) => {
        return (
          <Box key={deck.id} p={4}>
            <Link href={`/decks/${deck.id}`}>
              <Text>
                id: {deck.id} <br />
                name: {deck.name} <br />
                public: {String(deck.public)}
                <br />
                user: {deck.userId} <br />
                createdAt: {deck.createdAt}
              </Text>
              {deck.keyCard && (
                <CardImg
                  categoryId={deck.keyCard.categoryId}
                  imgFileName={deck.keyCard.imgFileName}
                  width={200}
                />
              )}
            </Link>
            {user?.id === deck.userId && (
              <HStack spacing={'1'} mt={1}>
                <Button
                  size={'sm'}
                  onClick={() => updateDeck(deck.id, !deck.public)}
                >
                  更新
                </Button>
                <Button size={'sm'} onClick={() => deleteDeck(deck.id)}>
                  削除
                </Button>
              </HStack>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
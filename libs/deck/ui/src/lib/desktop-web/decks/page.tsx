import { DeckDB } from '@beelzebub/shared/db';
import { Box, Button, Heading } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { z } from 'zod';

const useGetDecks = () => {
  const supabaseClient = useSupabaseClient();
  const { data, mutate } = useSWR('/supabase/db/me/decks', async () => {
    const { data } = await supabaseClient.from('decks').select();
    const parsed = z.array(DeckDB).parse(data);
    return parsed;
  });
  return { data, mutate };
};

export const DecksPage: FC = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const { data: decks, mutate } = useGetDecks();

  const createDeck = useCallback(async () => {
    if (user == null) {
      return;
    }
    const deck: Omit<DeckDB, 'id' | 'created_at'> = {
      user_id: user.id,
      public: true,
    };
    await supabaseClient.from('decks').insert({ ...deck });
    mutate();
    return;
  }, [mutate, supabaseClient, user]);
  const updateDeck = useCallback(async () => {
    if (user == null) {
      return;
    }
    await supabaseClient
      .from('decks')
      .update({ public: false, user_id: user.id })
      .eq('id', '09f9af4b-b5a4-438a-adbd-adc02ddb0d00');
    return;
  }, [supabaseClient, user]);
  const deleteDeck = useCallback(async () => {
    if (user == null) {
      return;
    }
    await supabaseClient
      .from('decks')
      .delete()
      .eq('id', '0c4bc9f1-f87b-436c-ae4f-edaa4e832e38');
    mutate();
    return;
  }, [mutate, supabaseClient, user]);

  useEffect(() => {
    const get = async () => {
      const res = await supabaseClient.from('decks').select();
      console.log('---- decks: ', res);
    };
    get();
  });

  return (
    <Box as="main" px="6" pt="4" pb="8">
      <Heading as="h1" fontSize={'lg'}>
        デッキリスト
      </Heading>
      <Button onClick={createDeck}>新規作成</Button>
      <Button onClick={updateDeck}>更新</Button>
      <Button onClick={deleteDeck}>削除</Button>

      {decks?.map((deck) => {
        return (
          <Box key={deck.id} p={4}>
            id: {deck.id} <br />
            public: {String(deck.public)}
            <br />
            user: {deck.user_id} <br />
            createdAt: {deck.created_at}
          </Box>
        );
      })}
    </Box>
  );
};

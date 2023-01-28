import {
  convertToDeckJoinedDeckVersion,
  DeckDBJoinedDeckVersionsDB,
} from '@beelzebub/shared/db';
import { Deck, DeckJoinedDeckVersions } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useSWR from 'swr';
import { z } from 'zod';

export const useGetDecksJoinDeckVersions = (deckId: Deck['id']) => {
  const supabaseClient = useSupabaseClient();
  return useSWR(
    `/supabase/db/me/decks/${deckId}`,
    async () => {
      const { data } = await supabaseClient
        .from('decks')
        .select(
          `
          *,
          deck_versions:id ( * )
        `
        )
        .order('created_at', {
          ascending: false,
          foreignTable: 'deck_versions',
        })
        .eq('id', deckId);
      const parsed = z.array(DeckDBJoinedDeckVersionsDB).safeParse(data);

      if (!parsed.success) {
        console.error(
          '[ERROR] parse error decks joined deck_versions: ',
          parsed.error
        );
        return undefined;
      }
      const deck = parsed.data[0];
      const result: DeckJoinedDeckVersions =
        convertToDeckJoinedDeckVersion(deck);
      return result;
    },
    {
      revalidateOnFocus: false,
    }
  );
};

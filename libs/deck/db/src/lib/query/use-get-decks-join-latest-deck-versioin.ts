import { DeckJoinedLatestDeckVersion } from '@beelzebub/deck/domain';
import {
  convertToDeck,
  convertToDeckVersion,
  DeckDBJoinedDeckVersionsDB,
  DeckVersionDB,
} from '@beelzebub/shared/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useSWR from 'swr';
import { v4 } from 'uuid';
import { z } from 'zod';

export const useGetDecksJoinLatestDeckVersion = () => {
  const supabaseClient = useSupabaseClient();
  return useSWR(`/supabase/db/me/decks/?joinLatestDeckVersion`, async () => {
    const { data } = await supabaseClient
      .from('decks')
      .select(
        `
          *,
          deck_versions:id ( * )
        `
      )
      .order('created_at', { ascending: false, foreignTable: 'deck_versions' })
      .order('created_at', { ascending: false })
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
};

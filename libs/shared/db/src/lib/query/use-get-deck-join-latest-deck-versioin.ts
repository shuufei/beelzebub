import { Deck } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useSWR from 'swr';
import { v4 } from 'uuid';
import { z } from 'zod';
import { DeckDBJoinedDeckVersionsDB } from '../deck-joined-deck-versions';
import { DeckVersionDB, convertToDeckVersion } from '../deck-versions';
import { convertToDeck } from '../decks';

export const useGetDeckJoinLatestDeckVersion = (deckId: Deck['id']) => {
  const supabaseClient = useSupabaseClient();
  return useSWR(
    `/supabase/db/me/decks/${deckId}?joinLatestDeckVersion`,
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
        .limit(1, { foreignTable: 'deck_versions' })
        .eq('id', deckId);
      const parsed = z.array(DeckDBJoinedDeckVersionsDB).safeParse(data);
      if (!parsed.success) {
        console.error(
          '[ERROR] parse error decks joined deck_versions: ',
          parsed.error
        );
        return undefined;
      }
      const deckDB = parsed.data[0];
      if (deckDB == null) {
        console.error('[ERROR] deck is undefined: ');
        return undefined;
      }
      const latest: DeckVersionDB | undefined = deckDB.deck_versions[0];
      const deck = convertToDeck({
        id: deckDB.id,
        created_at: deckDB.created_at,
        user_id: deckDB.user_id,
        public: deckDB.public,
        name: deckDB.name,
        key_card: deckDB.key_card,
      });
      return {
        ...deck,
        latestDeckVersion: convertToDeckVersion(
          latest ?? {
            id: v4(),
            created_at: new Date().toISOString(),
            deck_id: deckDB.id,
            name: 'placeholder',
            cards: [],
            adjustment_cards: [],
            user_id: deckDB.user_id,
          }
        ),
      };
    }
  );
};

import { DeckDB, DeckVersionDB } from '@beelzebub/shared/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { v4 } from 'uuid';

export const useInsertDeck = () => {
  const supabaseClient = useSupabaseClient();
  const insert = useCallback(async (deck: DeckDB) => {
    const deckVersion: DeckVersionDB = {
      id: v4(),
      deck_id: deck.id,
      created_at: new Date().toISOString(),
      user_id: deck.user_id,
      cards: [],
      adjustment_cards: [],
    };
    const insertDeckResult = await supabaseClient
      .from('decks')
      .insert({ ...deck });
    if (insertDeckResult.error != null) {
      throw new Error(
        `failed insert deck: ${JSON.stringify(insertDeckResult.error)}`
      );
    }
    const insertDeckVersionResult = await supabaseClient
      .from('deck_versions')
      .insert({ ...deckVersion });
    if (insertDeckVersionResult.error != null) {
      throw new Error(
        `failed insert deck: ${JSON.stringify(insertDeckVersionResult.error)}`
      );
    }
    console.info('insert deck, deck_version: ');
  }, []);

  return insert;
};

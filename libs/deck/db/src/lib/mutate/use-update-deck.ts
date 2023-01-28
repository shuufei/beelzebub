import { DeckDB } from '@beelzebub/shared/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';

export const useUpdateDeck = () => {
  const supabaseClient = useSupabaseClient();
  const update = useCallback(async (deck: DeckDB) => {
    const updateDeckResult = await supabaseClient
      .from('decks')
      .update({
        name: deck.name,
        public: deck.public,
      })
      .eq('id', deck.id);
    if (updateDeckResult.error != null) {
      throw new Error(
        `failed insert deck: ${JSON.stringify(updateDeckResult.error)}`
      );
    }
    console.info('update deck ', updateDeckResult);
  }, []);

  return update;
};

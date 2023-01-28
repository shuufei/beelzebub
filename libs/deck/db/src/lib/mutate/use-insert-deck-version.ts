import { DeckVersionDB } from '@beelzebub/shared/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';

export const useInsertDeckVersion = () => {
  const supabaseClient = useSupabaseClient();

  const insert = useCallback(async (deckVersion: DeckVersionDB) => {
    const result = await supabaseClient
      .from('deck_versions')
      .insert({ ...deckVersion });
    return result;
  }, []);

  return insert;
};

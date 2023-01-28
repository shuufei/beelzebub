import { Deck } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';

export const useDeleteDeckById = () => {
  const supabaseClient = useSupabaseClient();
  const deleteDeck = useCallback(async (deckId: Deck['id']) => {
    await supabaseClient.from('deck_versions').delete().eq('deck_id', deckId);
    await supabaseClient.from('decks').delete().eq('id', deckId);
  }, []);
  return deleteDeck;
};

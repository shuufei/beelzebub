import { DeckVersionDB } from '@beelzebub/shared/db';
import { Deck } from '@beelzebub/shared/domain';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';
import { adjustmentCardsState } from '../state/adjustment-cards-state';
import { deckCardsState } from '../state/deck-cards-state';

export const useSaveDeckVersion = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const deckCards = useRecoilValue(deckCardsState);
  const adjustmentCards = useRecoilValue(adjustmentCardsState);

  const save = useCallback(
    async (deckId: Deck['id']) => {
      if (user == null) {
        return;
      }
      const deckVersionDB: DeckVersionDB = {
        id: v4(),
        created_at: new Date().toISOString(),
        deck_id: deckId,
        cards: deckCards.map((v) => ({
          category_id: v.card.categoryId,
          img_file_name: v.card.imgFileName,
          count: v.count,
        })),
        adjustment_cards: adjustmentCards.map((v) => ({
          category_id: v.categoryId,
          img_file_name: v.imgFileName,
        })),
        user_id: user.id,
        comment: '',
      };
      const result = await supabaseClient
        .from('deck_versions')
        .insert({ ...deckVersionDB });
      return result.data != null;
    },
    [adjustmentCards, deckCards, supabaseClient, user]
  );

  return save;
};

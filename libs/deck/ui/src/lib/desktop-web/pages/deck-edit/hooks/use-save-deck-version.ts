import { useInsertDeckVersion } from '@beelzebub/deck/db';
import { DeckVersionDB } from '@beelzebub/shared/db';
import { Deck, DeckVersion } from '@beelzebub/shared/domain';
import { useUser } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';
import { adjustmentCardsState } from '../state/adjustment-cards-state';
import { deckCardsState } from '../state/deck-cards-state';

export const useSaveDeckVersion = () => {
  const user = useUser();
  const deckCards = useRecoilValue(deckCardsState);
  const adjustmentCards = useRecoilValue(adjustmentCardsState);
  const insert = useInsertDeckVersion();

  const save = useCallback(
    async (deckId: Deck['id'], comment?: DeckVersion['comment']) => {
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
        comment,
      };
      return insert(deckVersionDB);
    },
    [adjustmentCards, deckCards, insert, user]
  );

  return save;
};

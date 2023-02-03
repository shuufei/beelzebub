import {
  getCardsByImgFileNamesFetcher,
  getDeckJoinLatestDeckVersionFetcher,
} from '@beelzebub/shared/db';
import { Deck, flatDeckCards } from '@beelzebub/shared/domain';
import { initializeBoardCards } from '@beelzebub/vs/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { useDispatcher } from '../state/dispatcher';

export const useSetDeck = () => {
  const dispatch = useDispatcher();
  const supabaseClient = useSupabaseClient();

  const setDeck = useCallback(
    async (deckId: Deck['id']) => {
      const deck = await getDeckJoinLatestDeckVersionFetcher([
        'cachkey',
        deckId,
        supabaseClient,
      ]);
      if (deck == null) {
        console.error('deck is undefined');
        return;
      }
      const imgFileNames = deck.latestDeckVersion.cards.map(
        (v) => v.imgFileName
      );
      const cards = await getCardsByImgFileNamesFetcher([
        'cachkey',
        imgFileNames,
        supabaseClient,
      ]);

      const flatted = flatDeckCards(
        deck?.latestDeckVersion.cards ?? [],
        cards ?? []
      );

      const boardCards = initializeBoardCards(flatted);
      const digitamaStackBoardCards = boardCards.filter(
        (boardCard) => boardCard.card.cardtype === 'デジタマ'
      );
      const stackBoardCards = boardCards.filter(
        (boardCard) => boardCard.card.cardtype !== 'デジタマ'
      );
      dispatch('me', {
        actionName: 'set-deck',
        data: {
          stack: stackBoardCards,
          digitamaStack: digitamaStackBoardCards,
        },
      });
    },
    [dispatch, supabaseClient]
  );

  return setDeck;
};

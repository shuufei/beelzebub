import { Card } from '@beelzebub/shared/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { adjustmentDeckCardsState } from '../state/adjustment-deck-cards-state';

export const useAddRemoveAdjustmentDeckCard = () => {
  const [adjsutmentDeckCards, setAdjustmentDeckCards] = useRecoilState(
    adjustmentDeckCardsState
  );
  const add = useCallback(
    (card: Card) => {
      const exists = adjsutmentDeckCards.find(
        (v) => v.card.imgFileName === card.imgFileName
      );

      const _adjsutmentDeckCards = exists
        ? adjsutmentDeckCards
        : [
            ...adjsutmentDeckCards,
            {
              card,
              count: 1,
            },
          ];
      setAdjustmentDeckCards(_adjsutmentDeckCards);
    },
    [adjsutmentDeckCards, setAdjustmentDeckCards]
  );

  const remove = useCallback(
    (card: Card) => {
      const exists = adjsutmentDeckCards.find(
        (v) => v.card.imgFileName === card.imgFileName
      );
      const _adjsutmentDeckCards = exists
        ? adjsutmentDeckCards.filter(
            (v) => v.card.imgFileName !== card.imgFileName
          )
        : adjsutmentDeckCards;
      setAdjustmentDeckCards(_adjsutmentDeckCards);
    },
    [adjsutmentDeckCards, setAdjustmentDeckCards]
  );

  return { addAdjustmentDeckCard: add, removeAdjustmentDeckCard: remove };
};

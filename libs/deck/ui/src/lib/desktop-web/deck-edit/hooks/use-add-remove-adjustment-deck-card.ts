import { Card } from '@beelzebub/shared/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { adjustmentCardsState } from '../state/adjustment-cards-state';

export const useAddRemoveAdjustmentDeckCard = () => {
  const [adjsutmentCards, setAdjustmentCards] =
    useRecoilState(adjustmentCardsState);
  const add = useCallback(
    (card: Card) => {
      const exists = adjsutmentCards.find(
        (v) => v.imgFileName === card.imgFileName
      );

      const _adjsutmentCards = exists
        ? adjsutmentCards
        : [...adjsutmentCards, card];
      setAdjustmentCards(_adjsutmentCards);
    },
    [adjsutmentCards, setAdjustmentCards]
  );

  const remove = useCallback(
    (card: Card) => {
      const exists = adjsutmentCards.find(
        (v) => v.imgFileName === card.imgFileName
      );
      const _adjsutmentCards = exists
        ? adjsutmentCards.filter((v) => v.imgFileName !== card.imgFileName)
        : adjsutmentCards;
      setAdjustmentCards(_adjsutmentCards);
    },
    [adjsutmentCards, setAdjustmentCards]
  );

  return { addAdjustmentDeckCard: add, removeAdjustmentDeckCard: remove };
};

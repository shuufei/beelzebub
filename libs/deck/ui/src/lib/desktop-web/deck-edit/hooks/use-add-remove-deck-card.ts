import { Card } from '@beelzebub/shared/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { deckCardsState } from '../state/deck-cards-state';

export const useAddRemoveDeckCard = () => {
  const [deckCards, setDeckCards] = useRecoilState(deckCardsState);
  const add = useCallback(
    (card: Card) => {
      const exists = deckCards.find(
        (v) => v.card.imgFileName === card.imgFileName
      );
      const _deckCards = exists
        ? deckCards.map((deckCard) => {
            if (deckCard.card.imgFileName === card.imgFileName) {
              return { ...deckCard, count: deckCard.count + 1 };
            }
            return deckCard;
          })
        : [
            ...deckCards,
            {
              card,
              count: 1,
            },
          ];
      setDeckCards(_deckCards.filter((v) => v.count > 0));
    },
    [deckCards, setDeckCards]
  );

  const remove = useCallback(
    (card: Card) => {
      const exists = deckCards.find(
        (v) => v.card.imgFileName === card.imgFileName
      );
      const _deckCards = exists
        ? deckCards.map((deckCard) => {
            if (deckCard.card.imgFileName === card.imgFileName) {
              return { ...deckCard, count: deckCard.count - 1 };
            }
            return deckCard;
          })
        : [...deckCards, { card, count: 1 }];
      setDeckCards(_deckCards.filter((v) => v.count > 0));
    },
    [deckCards, setDeckCards]
  );

  return { addDeckCard: add, removeDeckCard: remove };
};

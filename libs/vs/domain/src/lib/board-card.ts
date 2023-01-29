import { Card } from '@beelzebub/shared/domain';
import { v4 } from 'uuid';

export type BoardCard = {
  id: string;
  card: Card;
  evolutionOriginCards: Card[];
  isRest: boolean;
};

export const initializeBoardCards = (cards: Card[]): BoardCard[] => {
  return cards.map((v) => {
    return {
      id: v4(),
      card: v,
      evolutionOriginCards: [],
      isRest: false,
    };
  });
};

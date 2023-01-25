import { DeckJoinedDeckVersions, DeckVersion } from '@beelzebub/shared/domain';

export type DeckCardWithDiff = DeckVersion['cards'][number] & {
  diff: number;
};

export const getDeckCardsWithDiff = (
  current: DeckVersion['cards'],
  diff: DeckVersion['cards']
): DeckCardWithDiff[] => {
  const removedList = diff
    .filter(
      (card) => current.find((v) => v.imgFileName === card.imgFileName) == null
    )
    .map((v) => ({
      ...v,
      count: 0,
      diff: v.count * -1,
    }));
  const changedList = current.map((card) => {
    const diffTargetCard = diff.find((v) => v.imgFileName === card.imgFileName);
    return {
      ...card,
      diff: card.count - (diffTargetCard?.count ?? 0),
    };
  });
  return [...changedList, ...removedList];
};

export const getDiff = (
  deck: DeckJoinedDeckVersions,
  selectedVersion: DeckVersion
): {
  cards: DeckCardWithDiff[];
  adjustmentCards: DeckCardWithDiff[];
} => {
  const selectedVersioinIndex = deck.deckVersions.findIndex(
    (v) => v.id === selectedVersion.id
  );
  if (selectedVersioinIndex == null) {
    return {
      cards: [],
      adjustmentCards: [],
    };
  }
  const diffTarget = deck.deckVersions[selectedVersioinIndex + 1];
  if (diffTarget == null) {
    return {
      cards: selectedVersion.cards.map((v) => ({ ...v, diff: 0 })),
      adjustmentCards: selectedVersion.adjustmentCards.map((v) => ({
        ...v,
        diff: 0,
      })),
    };
  }
  return {
    cards: getDeckCardsWithDiff(selectedVersion.cards, diffTarget.cards),
    adjustmentCards: getDeckCardsWithDiff(
      selectedVersion.adjustmentCards,
      diffTarget.adjustmentCards
    ),
  };
};

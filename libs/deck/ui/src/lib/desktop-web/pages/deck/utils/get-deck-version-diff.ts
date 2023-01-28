import { DeckVersion } from '@beelzebub/shared/domain';
import { CardWithDiff } from '../components/card-list-with-diff';

export type DeckVersionDiff = {
  cards: CardWithDiff[];
  adjustmentCards: CardWithDiff[];
};

export const getDeckVersionDiff = (
  selectedVersion: DeckVersion,
  prevVersion?: DeckVersion
): DeckVersionDiff => {
  if (prevVersion == null) {
    return {
      cards: selectedVersion.cards.map(({ imgFileName, count }) => {
        const diff: CardWithDiff = {
          imgFileName,
          currentCount: count,
          diffCount: 0,
        };
        return diff;
      }),
      adjustmentCards: selectedVersion.adjustmentCards.map(
        ({ imgFileName }) => {
          const diff: CardWithDiff = {
            imgFileName,
            currentCount: 1,
            diffCount: 0,
          };
          return diff;
        }
      ),
    };
  }

  const removedCards: CardWithDiff[] = prevVersion.cards
    .filter((card) => {
      const currentExists = !!selectedVersion.cards.find(
        (v) => v.imgFileName === card.imgFileName
      );
      return !currentExists;
    })
    .map((card) => {
      return {
        imgFileName: card.imgFileName,
        currentCount: 0,
        diffCount: -1 * card.count,
      };
    });
  const changedCards: CardWithDiff[] = selectedVersion.cards.map((card) => {
    const prevCount =
      prevVersion.cards.find((v) => v.imgFileName === card.imgFileName)
        ?.count ?? 0;
    return {
      imgFileName: card.imgFileName,
      currentCount: card.count,
      diffCount: card.count - prevCount,
    };
  });

  const removedAdjustmentCards: CardWithDiff[] = prevVersion.adjustmentCards
    .filter((card) => {
      const currentExists = !!selectedVersion.adjustmentCards.find(
        (v) => v.imgFileName === card.imgFileName
      );
      return !currentExists;
    })
    .map((card) => {
      return {
        imgFileName: card.imgFileName,
        currentCount: 0,
        diffCount: -1,
      };
    });
  const changedAdjustmentCards: CardWithDiff[] =
    selectedVersion.adjustmentCards.map((card) => {
      const prevCount =
        prevVersion.adjustmentCards.find(
          (v) => v.imgFileName === card.imgFileName
        ) != null
          ? 1
          : 0;
      return {
        imgFileName: card.imgFileName,
        currentCount: 1,
        diffCount: 1 - prevCount,
      };
    });

  return {
    cards: [...changedCards, ...removedCards],
    adjustmentCards: [...changedAdjustmentCards, ...removedAdjustmentCards],
  };
};

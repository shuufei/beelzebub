import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import {
  DeckCardWithDiff,
  DeckAdjustmentCardWithDiff,
} from '../utils/get-diff-version';

type Mark = 'removed' | 'added' | 'nochanged';
type MarkedCard = Pick<DeckCardWithDiff, 'categoryId' | 'imgFileName'> & {
  mark: Mark;
};

const getDeckCardNoChangedCount = (card: DeckCardWithDiff) => {
  if (card.diff === 0 || card.diff < 0) {
    return card.count;
  } else if (card.diff > 0) {
    const count = card.count - card.diff;
    return count > 0 ? count : 0;
  }
  return 0;
};

const getDeckAdjustmentCardNoChangedCount = (
  card: DeckAdjustmentCardWithDiff
) => {
  return card.diff === 0 ? 1 : 0;
};

const isDeckCardWithDiff = (
  v: DeckCardWithDiff | DeckAdjustmentCardWithDiff
): v is DeckCardWithDiff => {
  return 'count' in v;
};

export const CardList: FC<{
  cards: DeckCardWithDiff[] | DeckAdjustmentCardWithDiff[];
  showDiff?: boolean;
}> = ({ cards, showDiff = false }) => {
  const markedCards: MarkedCard[] = useMemo(() => {
    return showDiff
      ? cards
          .map((card) => {
            const currentCount = isDeckCardWithDiff(card)
              ? getDeckCardNoChangedCount(card)
              : getDeckAdjustmentCardNoChangedCount(card);
            const currentCards: MarkedCard[] = new Array(currentCount)
              .fill(null)
              .map(() => ({
                categoryId: card.categoryId,
                imgFileName: card.imgFileName,
                mark: 'nochanged',
              }));
            const mark: MarkedCard['mark'] =
              card.diff === 0
                ? 'nochanged'
                : card.diff > 0
                ? 'added'
                : 'removed';
            const diffCards: MarkedCard[] = new Array(Math.abs(card.diff))
              .fill(null)
              .map(() => ({
                categoryId: card.categoryId,
                imgFileName: card.imgFileName,
                mark: mark,
              }));

            return [...currentCards, ...diffCards];
          })
          .flat()
      : cards
          .map((v) => {
            const count = isDeckCardWithDiff(v) ? v.count : v.diff >= 0 ? 1 : 0; // 調整用カードはあるかないかなので、diffが0以下の場合は現在のversionでは0枚となる
            return new Array(count).fill(null).map(() => ({
              categoryId: v.categoryId,
              imgFileName: v.imgFileName,
              mark: 'nochanged' as const,
            }));
          })
          .flat();
  }, [cards, showDiff]);

  return (
    <Wrap flex={1} spacing={1}>
      {markedCards.map((card, i) => {
        return (
          <WrapItem
            key={`${card.imgFileName}:${i}`}
            p={1.5}
            bg={
              card.mark === 'nochanged'
                ? ''
                : card.mark === 'added'
                ? 'green.300'
                : 'red.300'
            }
          >
            <CardImg
              categoryId={card.categoryId}
              imgFileName={card.imgFileName}
              width={70}
            />
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

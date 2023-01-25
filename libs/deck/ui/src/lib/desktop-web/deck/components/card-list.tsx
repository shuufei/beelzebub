import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { DeckCardWithDiff } from '../page';

type Mark = 'removed' | 'added' | 'nochanged';
type MarkedCard = Pick<DeckCardWithDiff, 'categoryId' | 'imgFileName'> & {
  mark: Mark;
};

const getCurrentCount = (card: DeckCardWithDiff) => {
  if (card.diff === 0 || card.diff < 0) {
    return card.count;
  } else if (card.diff > 0) {
    const count = card.count - card.diff;
    return count > 0 ? count : 0;
  }
  return 0;
};

export const CardList: FC<{
  cards: DeckCardWithDiff[];
  showDiff?: boolean;
}> = ({ cards, showDiff = false }) => {
  const markedCards: MarkedCard[] = useMemo(() => {
    return showDiff
      ? cards
          .map((card) => {
            const current: MarkedCard[] = new Array(getCurrentCount(card))
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
            const diff: MarkedCard[] = new Array(Math.abs(card.diff))
              .fill(null)
              .map(() => ({
                categoryId: card.categoryId,
                imgFileName: card.imgFileName,
                mark: mark,
              }));

            return [...current, ...diff];
          })
          .flat()
      : cards
          .map((v) =>
            new Array(v.count).fill(null).map(() => ({
              categoryId: v.categoryId,
              imgFileName: v.imgFileName,
              mark: 'nochanged' as const,
            }))
          )
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

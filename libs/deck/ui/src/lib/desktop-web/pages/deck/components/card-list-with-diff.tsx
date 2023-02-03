import { useGetCardsByImgFileNames } from '@beelzebub/shared/db';
import { categorizeCards } from '@beelzebub/shared/domain';
import { Card } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

type Mark = 'removed' | 'added' | 'nochanged';
type MarkedCard = Card & {
  mark: Mark;
};

export type CardWithDiff = Pick<Card, 'imgFileName'> & {
  currentCount: number;
  diffCount: number;
};

const getNoChangedCardCount = ({ diffCount, currentCount }: CardWithDiff) => {
  if (diffCount === 0) {
    return currentCount;
  } else if (diffCount >= 1) {
    return currentCount - diffCount;
  } else if (diffCount <= -1) {
    return currentCount <= 0 ? 0 : currentCount; // diffCountはマイナス値
  }
  return 0;
};

export const CardListWithDiff: FC<{
  cardsWithDiff: CardWithDiff[];
}> = ({ cardsWithDiff }) => {
  const imgFileNames = cardsWithDiff.map((v) => v.imgFileName);
  const { data: cards } = useGetCardsByImgFileNames(imgFileNames);

  const markedCards: MarkedCard[] = useMemo(() => {
    return cardsWithDiff
      .map((cardWithDiff) => {
        const card = cards?.find(
          (card) => card.imgFileName === cardWithDiff.imgFileName
        );
        if (card == null) {
          return [];
        }

        /**
         * NOTE:
         * 下記の数を算出
         * - 変化がない枚数
         * - 追加された枚数
         * - 削除された枚数
         */
        const noChangedCardCount = getNoChangedCardCount(cardWithDiff);
        const addedCardCount =
          cardWithDiff.diffCount >= 1 ? cardWithDiff.diffCount : 0;
        const removedCardCount =
          cardWithDiff.diffCount <= -1 ? Math.abs(cardWithDiff.diffCount) : 0;

        const noChangedCards: MarkedCard[] = new Array<MarkedCard>(
          noChangedCardCount
        ).fill({
          ...card,
          mark: 'nochanged',
        });
        const addedCards: MarkedCard[] = new Array<MarkedCard>(
          addedCardCount
        ).fill({
          ...card,
          mark: 'added',
        });
        const removedCards: MarkedCard[] = new Array<MarkedCard>(
          removedCardCount
        ).fill({
          ...card,
          mark: 'removed',
        });
        return [...noChangedCards, ...addedCards, ...removedCards];
      })
      .flat();
  }, [cards, cardsWithDiff]);

  const categorized = categorizeCards(markedCards);

  return (
    <Wrap flex={1} spacing={1}>
      {Object.entries(categorized).map(([, value]) => {
        return value.map((card, i) => {
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
        });
      })}
    </Wrap>
  );
};

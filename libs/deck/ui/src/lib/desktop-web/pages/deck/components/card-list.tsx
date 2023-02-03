import { useGetCardsByImgFileNames } from '@beelzebub/shared/db';
import { categorizeCards } from '@beelzebub/shared/domain';
import { Card } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

export const CardList: FC<{
  cardsWithCount: (Pick<Card, 'imgFileName'> & { count: number })[];
}> = ({ cardsWithCount }) => {
  const imgFileNames = cardsWithCount.map((v) => v.imgFileName);
  const { data: cards } = useGetCardsByImgFileNames(imgFileNames);

  const flatted: Card[] = useMemo(() => {
    return cardsWithCount
      .map((cardWithCount) => {
        const card = cards?.find(
          (card) => card.imgFileName === cardWithCount.imgFileName
        );
        if (card == null) {
          return [];
        }
        return new Array<Card>(cardWithCount.count).fill(card);
      })
      .flat();
  }, [cards, cardsWithCount]);

  const categorized = categorizeCards(flatted);

  return (
    <Wrap flex={1} spacing={1}>
      {Object.entries(categorized).map(([, value]) => {
        return value.map((card, i) => {
          return (
            <WrapItem key={`${card.imgFileName}:${i}`} p={1.5}>
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

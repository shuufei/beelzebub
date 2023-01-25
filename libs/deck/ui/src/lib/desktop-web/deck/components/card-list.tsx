import { DeckVersion } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC } from 'react';

export const CardList: FC<{ cards: DeckVersion['cards'] }> = ({ cards }) => {
  return (
    <Wrap flex={1}>
      {cards.map((card) => {
        return new Array(card.count).fill(null).map((_, i) => {
          return (
            <WrapItem key={i}>
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

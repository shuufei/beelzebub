import { Card } from '@beelzebub/shared/domain';
import { Box, Heading, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { groupBy } from 'lodash';
import Image from 'next/image';
import { FC } from 'react';

const CardList: FC<{ cards: Card[] }> = ({ cards }) => {
  const groupedCardList = Object.values(groupBy(cards, 'imgFileName')).map(
    (cards) => {
      return {
        card: cards[0],
        count: cards.length,
      };
    }
  );
  return (
    <Wrap spacing={2}>
      {groupedCardList.map((groupedCard) => {
        return (
          <WrapItem key={`${groupedCard.card.imgFileName}`}>
            <VStack spacing={0.5}>
              <Image
                src={getFilePath(groupedCard.card)}
                alt=""
                width={70}
                height={70 * cardAspect}
              />
              <Text fontSize={'xs'} fontWeight={'semibold'}>
                x {groupedCard.count}
              </Text>
            </VStack>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

const CardListSection: FC<{ cards: Card[]; title: string }> = ({
  cards,
  title,
}) => {
  return (
    cards.length > 0 && (
      <Box as="section">
        <Heading as="h2" fontSize={'xs'} color={'gray.600'}>
          {title}
        </Heading>
        <Box mt="1.5">
          <CardList cards={cards} />
        </Box>
      </Box>
    )
  );
};

const getFilePath = (card: Card): string => {
  return `${process.env.NX_FILE_SERVER_ENDPOINT}/deck/images/${card.category}/${card.imgFileName}`;
};

const cardAspect = 600 / 430;

export const DeckRecipePreview: FC<{ deckCards: Card[]; deckName: string }> = ({
  deckCards,
  deckName,
}) => {
  const digitamaList = deckCards.filter((v) => v.lv === 'Lv.2');
  const lv3List = deckCards.filter((v) => v.lv === 'Lv.3');
  const lv4List = deckCards.filter((v) => v.lv === 'Lv.4');
  const lv5List = deckCards.filter((v) => v.lv === 'Lv.5');
  const lv6List = deckCards.filter((v) => v.lv === 'Lv.6');
  const lv7List = deckCards.filter((v) => v.lv === 'Lv.7');
  const tamerList = deckCards.filter((v) => v.cardtype === 'テイマー');
  const optionList = deckCards.filter((v) => v.cardtype === 'オプション');
  return (
    <Box p="2">
      <Text fontSize={'md'} fontWeight={'semibold'}>
        {deckName}
      </Text>
      <Wrap alignItems={'flex-start'} spacingX={8} spacingY={5} mt={'4'}>
        <WrapItem>
          <CardListSection cards={digitamaList} title="デジタマ" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={lv3List} title="Lv.3" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={lv4List} title="Lv.4" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={lv5List} title="Lv.5" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={lv6List} title="Lv.6" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={lv7List} title="Lv.7" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={tamerList} title="テイマー" />
        </WrapItem>
        <WrapItem>
          <CardListSection cards={optionList} title="オプション" />
        </WrapItem>
      </Wrap>
    </Box>
  );
};

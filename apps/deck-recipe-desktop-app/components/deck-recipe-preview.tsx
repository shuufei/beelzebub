import { Card } from '@beelzebub/shared/domain';
import { Box, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

const CardList: FC<{ cards: Card[] }> = ({ cards }) => {
  return (
    <Wrap spacing={2} justify={'center'}>
      {cards.map((card, i) => {
        return (
          <WrapItem key={`${card.imgFileName}-${i}`}>
            <VStack spacing={0.5}>
              <Box boxShadow={'sm'}>
                <Image
                  src={getFilePath(card)}
                  alt=""
                  width={160}
                  height={160 * cardAspect}
                />
              </Box>
            </VStack>
          </WrapItem>
        );
      })}
    </Wrap>
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
    <Box px="8" pt="4" pb="8" border="1px" borderColor={'gray.200'}>
      <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'}>
        {deckName}
      </Text>
      <Box mt={'3'}>
        <CardList
          cards={[
            ...digitamaList,
            ...lv3List,
            ...lv4List,
            ...lv5List,
            ...lv6List,
            ...lv7List,
            ...tamerList,
            ...optionList,
          ]}
        />
      </Box>
    </Box>
  );
};

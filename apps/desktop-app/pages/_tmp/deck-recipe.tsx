import { Card } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { validateAuthorizedRequest } from '../../shared/ssr/validate-authorized-request';

const getCategoryId = (categoryName: string) => {
  switch (categoryName) {
    case 'BT01':
      return '503001';
    case 'BT02':
      return '503002';
    case 'BT03':
      return '503003';
    case 'BT04':
      return '503004';
    case 'BT05':
      return '503005';
    case 'BT06':
      return '503006';
    case 'BT07':
      return '503008';
    case 'BT08':
      return '503009';
    case 'BT09':
      return '503011';
    case 'BT10':
      return '503012';
    case 'BT11':
      return '503014';
    case 'BT12':
      return '503015';
    case 'ST01':
      return '503101';
    case 'ST02':
      return '503102';
    case 'ST03':
      return '503103';
    case 'ST04':
      return '503104';
    case 'ST05':
      return '503105';
    case 'ST06':
      return '503106';
    case 'ST07':
      return '503107';
    case 'ST08':
      return '503108';
    case 'ST09':
      return '503109';
    case 'ST10':
      return '503110';
    case 'ST11':
      return '503111';
    case 'ST12':
      return '503112';
    case 'ST13':
      return '503113';
    case 'ST14':
      return '503114';
    case 'EX01':
      return '503007';
    case 'EX02':
      return '503010';
    case 'EX03':
      return '503013';
    case 'EX04':
      return '503016';
    case 'PRO':
      return '503901';
    default:
      return '';
  }
};

const CardList: FC<{ cards: Card[] }> = ({ cards }) => {
  return (
    <Wrap spacing={2} justify={'center'}>
      {cards.map((card, i) => {
        return (
          <WrapItem key={`${card.imgFileName}-${i}`}>
            <VStack spacing={0.5}>
              <Box boxShadow={'sm'}>
                <CardImg
                  categoryId={getCategoryId((card as any).category)}
                  imgFileName={card.imgFileName}
                  width={160}
                />
              </Box>
            </VStack>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

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

export function Index() {
  const [deckCards, setDeckCards] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState('');

  const loadDeckJsonFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file == null) {
        return;
      }
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const parsed = JSON.parse(e.target?.result as string) as Card[];
        setDeckCards(parsed);
      };
    },
    []
  );

  return (
    <Box as="main" px="6" py="4">
      <Heading as={'h1'} fontSize={'md'}>
        デッキレシピプレビュー
      </Heading>

      <Box p="2" maxW={'md'}>
        <FormControl mt="4">
          <FormLabel>デッキ名</FormLabel>
          <Input
            type="text"
            onChange={(event) => {
              setDeckName(event.target.value);
            }}
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>デッキファイル</FormLabel>
          <Input
            type="file"
            border={'none'}
            accept=".json"
            p="0"
            rounded={0}
            onChange={loadDeckJsonFile}
          />
        </FormControl>
      </Box>
      <Divider mt="4" mb="4" borderColor={'gray.900'} />
      {deckCards.length > 0 && (
        <DeckRecipePreview deckCards={deckCards} deckName={deckName} />
      )}
    </Box>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const validateResult = await validateAuthorizedRequest(ctx);
  if (!validateResult.isValid) {
    return {
      redirect: validateResult.redirect,
    };
  }
  return {
    props: {},
  };
};

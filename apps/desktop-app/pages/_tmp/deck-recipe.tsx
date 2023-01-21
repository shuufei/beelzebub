import { Card } from '@beelzebub/shared/domain';
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
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { CardImg } from '../../shared/components/card-img';
import { APP_ACCESS_CHECK_KEY } from '../api/set-cookie-app-access-key';

const CardList: FC<{ cards: Card[] }> = ({ cards }) => {
  return (
    <Wrap spacing={2} justify={'center'}>
      {cards.map((card, i) => {
        return (
          <WrapItem key={`${card.imgFileName}-${i}`}>
            <VStack spacing={0.5}>
              <Box boxShadow={'sm'}>
                <CardImg card={card} width={160} />
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
  const parsedCookies = parse(ctx.req.headers.cookie ?? '');
  const correctRequest =
    parsedCookies[APP_ACCESS_CHECK_KEY] ===
    process.env.NEXT_BEELZEBUB_ACCESS_KEY;
  if (!correctRequest) {
    return {
      redirect: {
        permanent: true,
        destination: '/service-suspended',
      },
    };
  }

  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session,
    },
  };
};

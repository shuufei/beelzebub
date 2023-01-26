import { CardDB, convertToCard } from '@beelzebub/shared/db';
import { Card } from '@beelzebub/shared/domain';
import {
  Box,
  Divider,
  HStack,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FC, memo, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';
import { z } from 'zod';
import { DeckJoinedLatestDeckVersion } from '../../domain/deck-joined-latest-deck-version';
import { DeckCard } from '../domain/deck-card';
import { adjustmentDeckCardsState } from '../state/adjustment-deck-cards-state';
import { deckCardsState } from '../state/deck-cards-state';
import { AdjustmentDeckCardItem } from './adjustment-deck-card-item';
import { DeckCardItem } from './deck-card-item';

const useGetCards = (imgFileNames: Card['imgFileName'][]) => {
  const supabaseClient = useSupabaseClient();
  return useSWR(
    `/supabase/database/cards?imgFileNames=${imgFileNames.join(',')}`,
    async () => {
      const res = await supabaseClient
        .from('cards')
        .select()
        .in('img_file_name', imgFileNames);
      if (res.error != null) {
        console.error('failed get cards: ', res.error);
        return [];
      }
      const parsedCardDBList = z.array(CardDB).parse(res.data);
      const cards = parsedCardDBList.map((cardDB) => {
        return convertToCard(cardDB);
      });
      return cards;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );
};

type CategorizedCards = {
  digitama: DeckCard[];
  LvNone: DeckCard[];
  Lv3: DeckCard[];
  Lv4: DeckCard[];
  Lv5: DeckCard[];
  Lv6: DeckCard[];
  Lv7: DeckCard[];
  tamer: DeckCard[];
  option: DeckCard[];
};

const categorizeDeckCards = (deckCards: DeckCard[]): CategorizedCards => {
  const init: CategorizedCards = {
    digitama: [],
    LvNone: [],
    Lv3: [],
    Lv4: [],
    Lv5: [],
    Lv6: [],
    Lv7: [],
    tamer: [],
    option: [],
  };
  return deckCards.reduce((acc, curr) => {
    const tmp = { ...acc };
    if (curr.card.cardtype === 'デジタマ') {
      tmp.digitama = [...tmp.digitama, curr];
    } else if (curr.card.cardtype === 'テイマー') {
      tmp.tamer = [...tmp.tamer, curr];
    } else if (curr.card.cardtype === 'オプション') {
      tmp.option = [...tmp.option, curr];
    } else if (curr.card.lv === 'Lv.3') {
      tmp.Lv3 = [...tmp.Lv3, curr];
    } else if (curr.card.lv === 'Lv.4') {
      tmp.Lv4 = [...tmp.Lv4, curr];
    } else if (curr.card.lv === 'Lv.5') {
      tmp.Lv5 = [...tmp.Lv5, curr];
    } else if (curr.card.lv === 'Lv.6') {
      tmp.Lv6 = [...tmp.Lv6, curr];
    } else if (curr.card.lv === 'Lv.7') {
      tmp.Lv7 = [...tmp.Lv7, curr];
    } else if (curr.card.lv === '-' && curr.card.cardtype === 'デジモン') {
      tmp.LvNone = [...tmp.LvNone, curr];
    }
    return tmp;
  }, init);
};

export const DeckCardList: FC<{ deck: DeckJoinedLatestDeckVersion }> = memo(
  ({ deck }) => {
    const [deckCards, setDeckCards] = useRecoilState(deckCardsState);
    const [adjustmentDeckCards, setAdjustmentDeckCards] = useRecoilState(
      adjustmentDeckCardsState
    );

    const cardImgFileNames = deck.latestDeckVersion.cards.map(
      (v) => v.imgFileName
    );
    const adjustmentCardImgFileNames =
      deck.latestDeckVersion.adjustmentCards.map((v) => v.imgFileName);
    const { data: cards } = useGetCards(cardImgFileNames);
    const { data: adjustmentCards } = useGetCards(adjustmentCardImgFileNames);

    useEffect(() => {
      const _deckCards = cards?.map((card) => {
        const count =
          deck.latestDeckVersion.cards.find(
            (v) => v.imgFileName === card.imgFileName
          )?.count ?? 0;
        const deckCard: DeckCard = {
          card,
          count,
        };
        return deckCard;
      });
      setDeckCards(_deckCards ?? []);
    }, [cards, deck.latestDeckVersion.cards, setDeckCards]);

    useEffect(() => {
      const _adjustmentDeckCards = adjustmentCards?.map((card) => {
        const count =
          deck.latestDeckVersion.adjustmentCards.find(
            (v) => v.imgFileName === card.imgFileName
          )?.count ?? 0;
        const adjustmentCard: DeckCard = {
          card,
          count,
        };
        return adjustmentCard;
      });
      setAdjustmentDeckCards(_adjustmentDeckCards ?? []);
    }, [
      adjustmentCards,
      deck.latestDeckVersion.adjustmentCards,
      setAdjustmentDeckCards,
    ]);

    const categorizedDeckCards = useMemo(() => {
      return categorizeDeckCards(deckCards);
    }, [deckCards]);
    const categorizedAdjustmentDeckCards = useMemo(() => {
      return categorizeDeckCards(adjustmentDeckCards);
    }, [adjustmentDeckCards]);

    const cardTotalCount = useMemo(() => {
      return deckCards.reduce((acc, curr) => {
        return acc + curr.count;
      }, 0);
    }, [deckCards]);

    if (cards == null || adjustmentCards == null) {
      return <Spinner />;
    }

    return (
      <Box p={3}>
        <HStack
          justifyContent={'space-between'}
          px={2}
          py={1.5}
          mb={4}
          w={'full'}
          bg={'gray.700'}
          rounded={'sm'}
        >
          <Text color={'white'} fontSize={'sm'}>
            Total
          </Text>
          <Text
            py={0.5}
            px={2}
            bg={'white'}
            rounded={'sm'}
            color={'gray.700'}
            fontSize={'xs'}
          >
            {cardTotalCount}
          </Text>
        </HStack>
        {Object.entries(categorizedDeckCards).map(([key, value]) => {
          return (
            <VStack key={key} pb={6} alignItems={'flex-start'} spacing={1}>
              <HStack justifyContent={'space-between'} w={'full'} px={2}>
                <Text fontSize={'xs'} fontWeight={'semibold'}>
                  {key}
                </Text>
                <Text
                  py={0.5}
                  px={2}
                  bg={'gray.700'}
                  rounded={'sm'}
                  color={'white'}
                  fontSize={'xs'}
                >
                  {value.reduce((acc, curr) => acc + curr.count, 0)}
                </Text>
              </HStack>
              <Divider borderColor={'gray.400'} />
              <Wrap spacingX={3} spacingY={4} p={1}>
                {value.map(({ card, count }) => {
                  return (
                    <WrapItem key={card.imgFileName}>
                      <DeckCardItem deckCard={{ card, count }} />
                    </WrapItem>
                  );
                })}
              </Wrap>
            </VStack>
          );
        })}
        <Box mt={4}>
          <HStack px={2} justifyContent={'flex-start'}>
            <Text fontSize={'xs'} fontWeight={'semibold'}>
              調整用
            </Text>
          </HStack>
          <Divider borderColor={'gray.400'} mt={1} />
          <Wrap spacingX={3} spacingY={4} p={1} mt={1}>
            {Object.entries(categorizedAdjustmentDeckCards).map(
              ([key, value]) => {
                return value.map(({ card }) => {
                  return (
                    <WrapItem key={card.imgFileName}>
                      <AdjustmentDeckCardItem deckCard={{ card, count: 0 }} />
                    </WrapItem>
                  );
                });
              }
            )}
          </Wrap>
        </Box>
      </Box>
    );
  }
);

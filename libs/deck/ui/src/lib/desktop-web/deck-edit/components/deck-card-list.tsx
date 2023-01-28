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
import { FC, memo, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { categorizeDeckCards } from '../../domain/categorized-deck-cards';
import { DeckCard } from '../../domain/deck-card';
import { DeckJoinedLatestDeckVersion } from '../../domain/deck-joined-latest-deck-version';
import { useGetCards } from '../../hooks/use-get-cards';
import { adjustmentDeckCardsState } from '../state/adjustment-deck-cards-state';
import { deckCardsState } from '../state/deck-cards-state';
import { AdjustmentDeckCardItem } from './adjustment-deck-card-item';
import { DeckCardItem } from './deck-card-item';

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

import { CardDB, convertToCard } from '@beelzebub/shared/db';
import { Card, CardType, Category, Color, Lv } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Button, HStack, Spinner, VStack, WrapItem } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FC, useContext, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { z } from 'zod';
import { CardCustomButtonContext } from './card-list-provider';

const MAX_FETCH_COUNT = 50;

export type CardsPageProps = {
  page: number;
  query: CardsQuery;
  onFinishedLoadCards?: () => void;
};

export type CardsQuery = {
  categories?: Category['id'][];
  lvList?: Lv[];
  cardTypes?: CardType[];
  colors?: Color[];
  includeParallel?: boolean;
  name?: string;
};

const GetCardsResponseBody = z.object({
  cards: z.array(Card),
  hasNext: z.boolean(),
});
export type GetCardsResponseBody = z.infer<typeof GetCardsResponseBody>;

const useGetCards = (page: number, query: CardsQuery) => {
  const supabaseClient = useSupabaseClient();
  const cacheKey = useMemo(() => {
    return Object.entries(query).reduce((acc, [key, value]) => {
      return `${acc}&${key}=${value}`;
    }, `/supabase/db/cards?page=${page}&`);
  }, [page, query]);
  const { data } = useSWR(cacheKey, async () => {
    const offset = MAX_FETCH_COUNT * ((page <= 0 ? 1 : page) - 1);
    const limit = MAX_FETCH_COUNT * page;

    const dbQuery = supabaseClient
      .from('cards')
      .select()
      .range(offset, limit)
      .order('cardtype', { ascending: false })
      .order('lv', { ascending: true })
      .order('colors', { ascending: true })
      .order('no', { ascending: true })
      .in('parallel', ['false', query.includeParallel ?? true]);

    if (query.categories) {
      dbQuery.in('category_id', query.categories);
    }
    if (query.lvList) {
      dbQuery.in('lv', query.lvList);
    }
    if (query.cardTypes) {
      dbQuery.in('cardtype', query.cardTypes);
    }
    if (query.colors) {
      dbQuery.containedBy('colors', query.colors);
    }
    if (query.name) {
      dbQuery.like('name', `%${query.name}%`);
    }
    const { data, error } = await dbQuery;
    if (data != null) {
      const cards = z.array(CardDB).parse(data);
      const parsed: GetCardsResponseBody = {
        cards: cards.map(convertToCard),
        hasNext: cards.length >= MAX_FETCH_COUNT,
      };
      return parsed;
    } else {
      throw new Error(
        `failed get cards from supabase: ${JSON.stringify(error)}`
      );
    }
  });
  return data;
};

export const CardList: FC<CardsPageProps> = ({
  page,
  query,
  onFinishedLoadCards,
}) => {
  const customButton = useContext(CardCustomButtonContext);
  const data = useGetCards(page, query);

  useEffect(() => {
    if (data == null) {
      return;
    }
    if (!data.hasNext) {
      onFinishedLoadCards?.();
    }
  }, [data, onFinishedLoadCards]);

  return (
    <>
      {data == null && <Spinner size={'sm'} />}
      {(data?.cards ?? []).map((card) => {
        return (
          <WrapItem key={card.imgFileName}>
            <VStack boxShadow={'sm'} spacing={1}>
              <CardImg
                categoryId={card.categoryId}
                imgFileName={card.imgFileName}
                width={80}
              />
              {customButton != null ? (
                <HStack pb={2}>
                  <Button
                    size={'xs'}
                    onClick={() => {
                      customButton.onClick(card);
                    }}
                  >
                    {customButton.label}
                  </Button>
                </HStack>
              ) : null}
            </VStack>
          </WrapItem>
        );
      })}
    </>
  );
};

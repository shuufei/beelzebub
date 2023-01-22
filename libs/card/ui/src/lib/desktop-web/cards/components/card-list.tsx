import {
  GetCardsRequestQuery,
  GetCardsResponseBody,
} from '@beelzebub/card/api';
import { CardImg } from '@beelzebub/shared/ui';
import { Box, Spinner, WrapItem } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '../libs/fetcher';

export type CardsPageProps = {
  page: number;
  query: GetCardsRequestQuery;
};

export const CardList: FC<CardsPageProps> = ({ page, query }) => {
  const queryStrings = useMemo(() => {
    return new URLSearchParams({
      ...query,
      page: String(page),
    }).toString();
  }, [page, query]);
  const { data, isLoading } = useSWR<GetCardsResponseBody>(
    `/api/cards?${queryStrings}`,
    fetcher
  );
  return (
    <>
      {isLoading ?? <Spinner size={'sm'} />}
      {(data?.cards ?? []).map((card) => {
        return (
          <WrapItem key={card.imgFileName}>
            <Box boxShadow={'sm'}>
              <CardImg card={card} width={80} />
            </Box>
          </WrapItem>
        );
      })}
    </>
  );
};
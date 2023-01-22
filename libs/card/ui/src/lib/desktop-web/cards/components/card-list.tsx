import {
  GetCardsRequestQuery,
  GetCardsResponseBody,
} from '@beelzebub/card/api';
import { CardImg } from '@beelzebub/shared/ui';
import { Box, Spinner, WrapItem } from '@chakra-ui/react';
import { FC, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '../libs/fetcher';

export type CardsPageProps = {
  page: number;
  query: GetCardsRequestQuery;
  onFinishedLoadCards?: () => void;
};

export const CardList: FC<CardsPageProps> = ({
  page,
  query,
  onFinishedLoadCards,
}) => {
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

import { GetCardsRequestQuery } from '@beelzebub/card/api';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  useDisclosure,
  Wrap,
} from '@chakra-ui/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { useRecoilValue } from 'recoil';
import { SWRConfig } from 'swr';
import { CardList } from './components/card-list';
import { CardsFilter } from './components/filter-form/cards-filter';
import { InsertCardsModalDialog } from './components/insert-cards-modal-dialog';
import { filterConditionState } from './state/filter-conditions';

const convertQueryStringFromCondition = (condition: {
  [key: string]: boolean;
}) => {
  return Object.entries(condition)
    .filter(([, value]) => {
      return value;
    })
    .map(([key]) => key)
    .join(',');
};

export const CardsPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const tmpQueryRef = useRef<GetCardsRequestQuery>({});
  const [query, setQuery] = useState<GetCardsRequestQuery>({});
  const [finishedLoad, setFinishedLoad] = useState(false);
  const filterCondition = useRecoilValue(filterConditionState);

  useEffect(() => {
    const condition: GetCardsRequestQuery = {
      category: convertQueryStringFromCondition(filterCondition.category),
      colors: convertQueryStringFromCondition(filterCondition.color),
      lv: convertQueryStringFromCondition(filterCondition.lv),
      cardtype: convertQueryStringFromCondition(filterCondition.cardType),
      includeParallel: filterCondition.includeParallel ? 'true' : 'false',
    };
    tmpQueryRef.current = condition;
  }, [filterCondition]);

  const executeFilter = useCallback(() => {
    setPage(1);
    setQuery(tmpQueryRef.current);
    setFinishedLoad(false);
  }, []);

  return (
    <Box as="main" px="8" pt="4" pb="8">
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateIfStale: false,
          revalidateOnReconnect: false,
          errorRetryInterval: 60 * 1000,
        }}
      >
        <Box>
          <HStack justifyContent={'space-between'}>
            <Heading as="h1" fontSize={'xl'}>
              カード
            </Heading>
            <Box mt="4">
              <Button
                variant={'ghost'}
                onClick={onOpen}
                size={'sm'}
                leftIcon={<AddIcon />}
              >
                カードの登録
              </Button>
              <InsertCardsModalDialog isOpen={isOpen} onClose={onClose} />
            </Box>
          </HStack>
          <Box mt="4">
            <CardsFilter onExecuteFilter={executeFilter} />
          </Box>
        </Box>

        <Wrap mt="4">
          {new Array(page).fill(null).map((_, index) => {
            return (
              <CardList
                key={index}
                page={index + 1}
                query={query}
                onFinishedLoadCards={() => {
                  setFinishedLoad(true);
                }}
              />
            );
          })}
        </Wrap>

        {!finishedLoad && (
          <InView
            as="div"
            onChange={(inView) => {
              if (inView) {
                setPage((current) => current + 1);
              }
            }}
          >
            <Button
              mt="3"
              size={'xs'}
              variant={'outline'}
              onClick={() => {
                setPage((current) => current + 1);
              }}
            >
              load more...
            </Button>
          </InView>
        )}
      </SWRConfig>
    </Box>
  );
};

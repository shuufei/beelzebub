import { CardType, Category, Color, Lv } from '@beelzebub/shared/domain';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  useDisclosure,
  Wrap,
} from '@chakra-ui/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { useRecoilValue } from 'recoil';
import { SWRConfig } from 'swr';
import { CardList, CardsQuery } from './components/card-list';
import { CardsFilter } from './components/cards-filter';
import { InsertCardsModalDialog } from './components/insert-cards-modal-dialog';
import { filterConditionState } from './state/filter-conditions';

const convertQueryFromCondition = (condition: { [key: string]: boolean }) => {
  const values = Object.entries(condition)
    .filter(([, value]) => {
      return value;
    })
    .map(([key]) => key);
  return values.length > 0 ? values : undefined;
};

export const CardsPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const tmpQueryRef = useRef<CardsQuery>({});
  const [query, setQuery] = useState<CardsQuery>({});
  const [finishedLoad, setFinishedLoad] = useState(false);
  const filterCondition = useRecoilValue(filterConditionState);

  useEffect(() => {
    const condition: CardsQuery = {
      categories: convertQueryFromCondition(
        filterCondition.category
      ) as Category['id'][],
      colors: convertQueryFromCondition(filterCondition.color) as Color[],
      lvList: convertQueryFromCondition(filterCondition.lv) as Lv[],
      cardTypes: convertQueryFromCondition(
        filterCondition.cardType
      ) as CardType[],
      includeParallel: filterCondition.includeParallel,
      name: filterCondition.name,
    };
    tmpQueryRef.current = condition;
  }, [filterCondition]);

  const executeFilter = useCallback(() => {
    setPage(1);
    setQuery(tmpQueryRef.current);
    setFinishedLoad(false);
  }, []);

  return (
    <Box as="main" px="6" pt="4" pb="8">
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
            <Heading as="h1" fontSize={'lg'}>
              カードリスト
            </Heading>
            <Box mt="4">
              <Button
                variant={'ghost'}
                colorScheme={'blue'}
                onClick={onOpen}
                size={'xs'}
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

        <Divider mt="4" />

        <Wrap mt="4" px="3">
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

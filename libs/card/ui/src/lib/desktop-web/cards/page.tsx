import { GetCardsRequestQuery } from '@beelzebub/card/api';
import { Box, Button, Heading, useDisclosure, Wrap } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SWRConfig } from 'swr';
import { CardList } from './components/card-list';
import { FilterForm } from './components/filter-form/filter-form';
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
  const filterCondition = useRecoilValue(filterConditionState);

  useEffect(() => {
    const condition: GetCardsRequestQuery = {
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
  }, []);

  return (
    <Box as="main" p="4">
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateIfStale: false,
          revalidateOnReconnect: false,
          errorRetryInterval: 60 * 1000,
        }}
      >
        <Box>
          <Heading as="h1">カード</Heading>
          <Box mt="4">
            <Button onClick={onOpen}>カードの登録</Button>
            <InsertCardsModalDialog isOpen={isOpen} onClose={onClose} />
          </Box>
          <FilterForm onExecuteFilter={executeFilter} />
        </Box>

        <Wrap mt="4">
          {new Array(page).fill(null).map((_, index) => {
            return <CardList key={index} page={index + 1} query={query} />;
          })}
        </Wrap>
        <Button
          mt="3"
          onClick={() => {
            setPage((current) => current + 1);
          }}
        >
          load more...
        </Button>
      </SWRConfig>
    </Box>
  );
};

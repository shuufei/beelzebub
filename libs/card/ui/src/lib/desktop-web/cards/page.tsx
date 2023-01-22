import { GetCardsRequestQuery } from '@beelzebub/card/api';
import { Box, Button, Heading, useDisclosure, Wrap } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { SWRConfig } from 'swr';
import { CardList } from './components/card-list';
import { InsertCardsModalDialog } from './components/insert-cards-modal-dialog';

const query: GetCardsRequestQuery = {
  // category: 'BT03,BT01,ST13,BT06',
  // lv: 'Lv.3,Lv6,-',
  cardtype: 'デジモン,テイマー',
  colors: 'red,black',
  includeParallel: 'true',
  page: '1',
};
export const CardsPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
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
        <Heading as="h1">カード</Heading>
        <Box mt="4">
          <Button onClick={onOpen}>カードの登録</Button>
          <InsertCardsModalDialog isOpen={isOpen} onClose={onClose} />
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

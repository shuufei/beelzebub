import { Card } from '@beelzebub/shared/domain';
import {
  Box,
  Button,
  Heading,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { CardImg } from '../../components/card-img';
import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { InsertCardsModalDialog } from '../../features/cards/components/insert-cards-modal-dialog';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

type PageProps = {
  cards: Card[];
};

export const CardsPage: FC<PageProps> = ({ cards }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box as="main">
        <Heading as="h1">カード</Heading>
        <Button onClick={onOpen}>カードの登録</Button>
        <InsertCardsModalDialog isOpen={isOpen} onClose={onClose} />
        <Wrap>
          {cards.map((card) => {
            return (
              <WrapItem key={card.imgFileName}>
                <Box boxShadow={'sm'}>
                  <CardImg card={card} width={80} />
                </Box>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>
    </>
  );
};

export default CardsPage;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
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

  const res = await fetch(`http://localhost:4203/api/cards`, {
    headers: new Headers({
      cookie: ctx.req.headers.cookie ?? '',
    }),
  });
  //   TODO: error handling
  if (res.status !== 200) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  const data = await res.json();
  const cards = data.cards;
  return {
    props: {
      cards,
    },
  };
};

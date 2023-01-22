import { Card } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import {
  Box,
  Button,
  Heading,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FC } from 'react';
import { InsertCardsModalDialog } from './components/insert-cards-modal-dialog';

export type CardsPageProps = {
  cards: Card[];
};

export const CardsPage: FC<CardsPageProps> = ({ cards }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
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
  );
};

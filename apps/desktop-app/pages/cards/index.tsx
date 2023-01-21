import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { InsertCardsModalDialog } from '../../features/cards/components/insert-cards-modal-dialog';

export const CardPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box as="main">
        <Heading as="h1">カード</Heading>
        <Button onClick={onOpen}>カードの登録</Button>
        <InsertCardsModalDialog isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
};

export default CardPage;

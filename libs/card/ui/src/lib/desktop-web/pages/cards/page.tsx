import { CardListWithFilter } from '@beelzebub/shared/ui';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { SWRConfig } from 'swr';
import { InsertCardsModalDialog } from './components/insert-cards-modal-dialog';

export const CardsPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        </Box>

        <Box mt={3}>
          <CardListWithFilter />
        </Box>
      </SWRConfig>
    </Box>
  );
};

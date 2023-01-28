import { useGetDecksJoinLatestDeckVersion } from '@beelzebub/deck/db';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { CreateDeckModalDialog } from './components/create-deck-modal-dialog';
import { DeckCard } from './components/deck-card';

export const DecksPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: decks, mutate } = useGetDecksJoinLatestDeckVersion();

  return (
    <>
      <Box as="main" px="6" pt="4" pb="8">
        <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <Heading as="h1" fontSize={'lg'}>
            デッキリスト
          </Heading>

          <Button
            variant={'ghost'}
            mt={3}
            onClick={onOpen}
            colorScheme={'blue'}
            size={'sm'}
            leftIcon={<AddIcon />}
          >
            新規作成
          </Button>
        </HStack>

        {decks?.length === 0 ?? <Text>デッキが登録されていません</Text>}
        <VStack alignItems={'flex-start'} width={'full'} mt={6}>
          {decks?.map((deck) => {
            return (
              <Box width={'full'} key={deck.id}>
                <Link href={`/decks/${deck.id}`}>
                  <DeckCard deck={deck} />
                </Link>
              </Box>
            );
          })}
        </VStack>
      </Box>
      <CreateDeckModalDialog
        isOpen={isOpen}
        onClose={() => {
          onClose();
          mutate();
        }}
      />
    </>
  );
};

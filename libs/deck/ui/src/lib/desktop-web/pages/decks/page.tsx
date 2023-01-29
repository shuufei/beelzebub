import { DeckJoinedLatestDeckVersion } from '@beelzebub/deck/domain';
import {
  useGetUsers,
  useGetDecksJoinLatestDeckVersion,
} from '@beelzebub/shared/db';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';
import { CreateDeckModalDialog } from './components/create-deck-modal-dialog';
import { DeckCard } from './components/deck-card';

export const DecksPage: FC = () => {
  const user = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: decks, mutate } = useGetDecksJoinLatestDeckVersion();
  const [onlyMe, setOnlyMe] = useState(false);
  const { data: users } = useGetUsers();

  const filteredDecks: DeckJoinedLatestDeckVersion[] = useMemo(() => {
    return (
      decks?.filter((deck) => {
        return onlyMe ? deck.userId === user?.id : true;
      }) ?? []
    );
  }, [decks, onlyMe, user?.id]);

  return (
    <>
      <Box as="main" px="6" pt="4" pb="8">
        <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <VStack alignItems={'flex-start'} spacing={4}>
            <Heading as="h1" fontSize={'lg'}>
              デッキリスト
            </Heading>
            <Checkbox
              isChecked={onlyMe}
              onChange={(event) => {
                setOnlyMe(event.target.checked);
              }}
            >
              <Text fontSize={'sm'}>自分のデッキのみ表示</Text>
            </Checkbox>
          </VStack>

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

        {filteredDecks.length === 0 ?? <Text>デッキが登録されていません</Text>}
        <VStack alignItems={'flex-start'} width={'full'} mt={6}>
          {filteredDecks.map((deck) => {
            const userName = users?.find((v) => v.userId === deck.userId)?.name;
            return (
              <Box width={'full'} key={deck.id}>
                <Link href={`/decks/${deck.id}`}>
                  <DeckCard deck={deck} userName={userName} />
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

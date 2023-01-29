import { useGetDeckJoinLatestDeckVersion } from '@beelzebub/shared/db';
import { Deck } from '@beelzebub/shared/domain';
import {
  CardCustomButtonContext,
  CardListWithFilter,
} from '@beelzebub/shared/ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { CommitDeckVersionModalDialog } from './components/commit-deck-version-modal-dialog';
import { DeckCardList } from './components/deck-card-list';
import { useAddRemoveDeckCard } from './hooks/use-add-remove-deck-card';

export type DeckEditPageProps = {
  deckId: Deck['id'];
};

export const DeckEditPage: FC<DeckEditPageProps> = ({ deckId }) => {
  const { data: deck } = useGetDeckJoinLatestDeckVersion(deckId);
  const { addDeckCard } = useAddRemoveDeckCard();
  const {
    isOpen: isOpenCommitDeckVersionModal,
    onOpen: onOpenCommitDeckVersionModal,
    onClose: onCloseCommitDeckVersionModal,
  } = useDisclosure();

  return (
    <>
      <Box as="main" pb="8">
        <HStack
          justifyContent={'space-between'}
          alignItems={'center'}
          bg={'blue.600'}
          px={2}
          py={1.5}
        >
          <Box>
            <Link href={`/decks/${deckId}`}>
              <Button
                size={'sm'}
                variant={'ghost'}
                leftIcon={<ArrowBackIcon />}
                colorScheme={'gray'}
                color={'white'}
                _hover={{ bg: 'transparent' }}
              >
                戻る
              </Button>
            </Link>
          </Box>
          <Heading
            as="h1"
            fontSize={'sm'}
            mt={2}
            color={'white'}
            flex={1}
            textAlign={'center'}
          >
            デッキ編集
          </Heading>
          <Box>
            <Button size={'sm'} onClick={onOpenCommitDeckVersionModal}>
              保存
            </Button>
          </Box>
        </HStack>

        <HStack alignItems={'flex-start'} mt={4} px={4}>
          <Box flex={1}>
            <CardCustomButtonContext.Provider
              value={{
                label: '追加',
                onClick: (card) => {
                  addDeckCard(card);
                },
              }}
            >
              <CardListWithFilter />
            </CardCustomButtonContext.Provider>
          </Box>
          <Box
            pt={'3rem'}
            pb={12}
            w={'18rem'}
            h={'100vh'}
            position={'sticky'}
            top={0}
            overflow={'auto'}
          >
            {deck && <DeckCardList deck={deck} />}
          </Box>
        </HStack>
      </Box>
      {deck != null && (
        <CommitDeckVersionModalDialog
          deckId={deck.id}
          isOpen={isOpenCommitDeckVersionModal}
          onClose={onCloseCommitDeckVersionModal}
        />
      )}
    </>
  );
};

import { CardListProvider } from '@beelzebub/card/ui';
import {
  convertToDeck,
  convertToDeckVersion,
  DeckDBJoinedDeckVersionsDB,
  DeckVersionDB,
} from '@beelzebub/shared/db';
import { Deck } from '@beelzebub/shared/domain';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { FC } from 'react';
import useSWR from 'swr';
import { v4 } from 'uuid';
import { z } from 'zod';
import { DeckCardList } from './components/deck-card-list';

const useGetDeckJoinLatestDeckVersion = (deckId: Deck['id']) => {
  const supabaseClient = useSupabaseClient();
  const { data, mutate } = useSWR(
    `/supabase/db/me/decks/${deckId}?joinLatestDeckVersion`,
    async () => {
      const { data } = await supabaseClient
        .from('decks')
        .select(
          `
          *,
          deck_versions:id ( * )
        `
        )
        .order('created_at', {
          ascending: false,
          foreignTable: 'deck_versions',
        })
        .limit(1, { foreignTable: 'deck_versions' })
        .eq('id', deckId);
      const parsed = z.array(DeckDBJoinedDeckVersionsDB).safeParse(data);
      if (!parsed.success) {
        console.error(
          '[ERROR] parse error decks joined deck_versions: ',
          parsed.error
        );
        return undefined;
      }
      const deckDB = parsed.data[0];
      if (deckDB == null) {
        console.error('[ERROR] deck is undefined: ');
        return undefined;
      }
      const latest: DeckVersionDB | undefined = deckDB.deck_versions[0];
      const deck = convertToDeck({
        id: deckDB.id,
        created_at: deckDB.created_at,
        user_id: deckDB.user_id,
        public: deckDB.public,
        name: deckDB.name,
        key_card: deckDB.key_card,
      });
      return {
        ...deck,
        latestDeckVersion: convertToDeckVersion(
          latest ?? {
            id: v4(),
            created_at: new Date().toISOString(),
            deck_id: deckDB.id,
            name: 'placeholder',
            cards: [],
            adjustment_cards: [],
            user_id: deckDB.user_id,
          }
        ),
      };
    }
  );
  return { data, mutate };
};

export type DeckEditPageProps = {
  deckId: Deck['id'];
};

export const DeckEditPage: FC<DeckEditPageProps> = ({ deckId }) => {
  const { data: deck } = useGetDeckJoinLatestDeckVersion(deckId);

  return (
    <Box as="main" pb="8">
      <HStack
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'blue.600'}
        px={2}
        py={1.5}
      >
        <Box flex={1}>
          <Link href={`/decks/${deckId}`}>
            <Button
              size={'sm'}
              variant={'solid'}
              leftIcon={<ArrowBackIcon />}
              colorScheme={'gray'}
            >
              戻る
            </Button>
          </Link>
        </Box>
        <Heading as="h1" fontSize={'sm'} mt={2} color={'white'}>
          デッキ編集
        </Heading>
        <Text flex={1}></Text>
      </HStack>

      <HStack alignItems={'flex-start'} mt={4} px={4}>
        <Box flex={1}>
          <CardListProvider />
        </Box>
        <Box
          pt={'3rem'}
          pb={12}
          w={'16rem'}
          h={'100vh'}
          position={'sticky'}
          top={0}
          overflow={'auto'}
        >
          {deck && <DeckCardList deck={deck} />}
        </Box>
      </HStack>
    </Box>
  );
};

import {
  convertToDeckJoinedDeckVersion,
  DeckDBJoinedDeckVersionsDB,
} from '@beelzebub/shared/db';
import {
  Deck,
  DeckJoinedDeckVersions,
  DeckVersion,
} from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { FC, useMemo } from 'react';
import useSWR from 'swr';
import { z } from 'zod';
import { SAMPLE_DATA_VERSIONS } from './sample-data';

export type DeckPageProps = {
  deckId: Deck['id'];
};

const useGetDecksJoinDeckVersions = (deckId: Deck['id']) => {
  const supabaseClient = useSupabaseClient();
  const { data, mutate } = useSWR(
    `/supabase/db/me/decks/${deckId}`,
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
        .eq('id', deckId);
      const parsed = z.array(DeckDBJoinedDeckVersionsDB).safeParse(data);

      if (!parsed.success) {
        console.error(
          '[ERROR] parse error decks joined deck_versions: ',
          parsed.error
        );
        return undefined;
      }
      const deck = parsed.data[0];
      const result: DeckJoinedDeckVersions =
        convertToDeckJoinedDeckVersion(deck);
      return result;
    },
    {
      revalidateOnFocus: false,
    }
  );
  return { data, mutate };
};

export const DeckPage: FC<DeckPageProps> = ({ deckId }) => {
  const { data, mutate } = useGetDecksJoinDeckVersions(deckId);
  const user = useUser();
  const latestDeckVersion: DeckVersion | undefined = useMemo(() => {
    return data?.deckVersions[0];
  }, [data?.deckVersions]);
  const supabaseClient = useSupabaseClient();
  if (user == null) {
    return <Text>unauthorized</Text>;
  }

  const insertVersions = async () => {
    for (const version of SAMPLE_DATA_VERSIONS) {
      await supabaseClient.from('deck_versions').insert({ ...version });
    }
    mutate();
    return;
  };

  return (
    <Box as="main" px="6" pt="2" pb="8">
      <Link href="/decks">
        <Button size={'sm'} variant={'ghost'} leftIcon={<ArrowBackIcon />}>
          戻る
        </Button>
      </Link>
      <Heading as="h1" fontSize={'lg'} mt="4">
        デッキ
      </Heading>
      <Text>id: {data?.id}</Text>
      <Text>name: {data?.name}</Text>
      <Text>createdAt: {data?.createdAt}</Text>
      <Text>public: {data?.public ? 'true' : 'false'}</Text>
      <Text>user: {data?.userId}</Text>
      {data?.keyCard && (
        <CardImg
          categoryId={data.keyCard.categoryId}
          imgFileName={data.keyCard.imgFileName}
          width={200}
        />
      )}
      {latestDeckVersion?.cards.map((card) => {
        return (
          <CardImg
            key={card.imgFileName}
            categoryId={card.categoryId}
            imgFileName={card.imgFileName}
            width={100}
          />
        );
      })}
      {data?.deckVersions.map((deckVersion) => {
        return (
          <Box p={3} key={deckVersion.id}>
            <Text>created at: {deckVersion.createdAt}</Text>
            <Text>comment: {deckVersion.comment}</Text>
            <Text>cards: {deckVersion.cards.length}</Text>
            <Wrap>
              {deckVersion.cards.map((card) => {
                return new Array(card.count).fill(null).map((_, i) => {
                  return (
                    <WrapItem key={i}>
                      <CardImg
                        categoryId={card.categoryId}
                        imgFileName={card.imgFileName}
                        width={50}
                      />
                    </WrapItem>
                  );
                });
              })}
            </Wrap>
          </Box>
        );
      })}
      {/* <Button onClick={insertVersions}>Input Sample Data</Button> */}
    </Box>
  );
};

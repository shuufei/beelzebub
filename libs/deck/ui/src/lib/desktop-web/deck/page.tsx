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
import { ArrowBackIcon, LockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import d from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { z } from 'zod';
import { CardList } from './components/card-list';
import { DeckVersionCard } from './components/deck-version-card';
import { SAMPLE_DATA_VERSIONS } from './sample-data';

export type DeckPageProps = {
  deckId: Deck['id'];
};

export type DeckCardWithDiff = DeckVersion['cards'][number] & {
  diff: number;
};

const getDeckCardsWithDiff = (
  current: DeckVersion['cards'],
  diff: DeckVersion['cards']
): DeckCardWithDiff[] => {
  const removedList = diff
    .filter(
      (card) => current.find((v) => v.imgFileName === card.imgFileName) == null
    )
    .map((v) => ({
      ...v,
      count: 0,
      diff: v.count * -1,
    }));
  const changedList = current.map((card) => {
    const diffTargetCard = diff.find((v) => v.imgFileName === card.imgFileName);
    return {
      ...card,
      diff: card.count - (diffTargetCard?.count ?? 0),
    };
  });
  return [...changedList, ...removedList];
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
  const [selectedVersion, setSelectedVersion] = useState<
    DeckVersion | undefined
  >();
  const [showDiff, setShowDiff] = useState(true);
  const { data, mutate } = useGetDecksJoinDeckVersions(deckId);
  const user = useUser();

  const latestVersion: DeckVersion | undefined = useMemo(() => {
    return data?.deckVersions[0];
  }, [data?.deckVersions]);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    setSelectedVersion(latestVersion);
  }, [latestVersion]);

  const deckCards = useMemo(() => {
    return (selectedVersion ?? latestVersion)?.cards ?? [];
  }, [latestVersion, selectedVersion]);

  const deckAdjustmentCards = useMemo(() => {
    return (selectedVersion ?? latestVersion)?.adjustmentCards ?? [];
  }, [latestVersion, selectedVersion]);

  const diffTargetVersion = useMemo(() => {
    const selectedVersioinIndex = data?.deckVersions.findIndex(
      (v) => v.id === selectedVersion?.id
    );
    if (selectedVersioinIndex == null) {
      return;
    }
    const diffTarget = data?.deckVersions[selectedVersioinIndex + 1];
    return diffTarget;
  }, [data?.deckVersions, selectedVersion?.id]);

  const diffDeckCards: DeckCardWithDiff[] = useMemo(() => {
    if (diffTargetVersion == null) {
      return deckCards.map((v) => ({ ...v, diff: 0 }));
    }
    return getDeckCardsWithDiff(deckCards, diffTargetVersion.cards);
  }, [deckCards, diffTargetVersion]);

  const diffAdjustmentCards = useMemo(() => {
    if (diffTargetVersion == null) {
      return deckAdjustmentCards.map((v) => ({ ...v, diff: 0 }));
    }
    return getDeckCardsWithDiff(
      deckAdjustmentCards,
      diffTargetVersion.adjustmentCards
    );
  }, [deckAdjustmentCards, diffTargetVersion]);

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
      <HStack
        justifyContent={'space-between'}
        alignItems={'flex-start'}
        pt={2}
        pb={4}
      >
        <Box>
          <Link href="/decks">
            <Button size={'sm'} variant={'ghost'} leftIcon={<ArrowBackIcon />}>
              戻る
            </Button>
          </Link>
          <HStack alignItems={'center'} spacing={4} mt={1}>
            <HStack spacing={2}>
              <Heading as="h1" fontSize={'lg'}>
                {data?.name}
              </Heading>
              {data?.public === false && <LockIcon fontSize={'sm'} />}
            </HStack>
            <Button size={'xs'}>変更</Button>
          </HStack>
          <VStack
            fontSize={'sm'}
            color={'gray.600'}
            mt={1}
            spacing={0}
            alignItems={'flex-start'}
          >
            <Text>{data?.userId}</Text>
            <Text>
              {d(data?.createdAt).format('YYYY年MM月D日 HH時mm分ss秒')}
            </Text>
          </VStack>
          <Button variant={'outline'} size={'sm'} mt={3}>
            デッキ編集
          </Button>
        </Box>
        <VStack spacing={1}>
          {data?.keyCard != null ? (
            <CardImg
              categoryId={data?.keyCard.categoryId}
              imgFileName={data?.keyCard.imgFileName}
              width={70}
            />
          ) : (
            <Image
              src={'/images/card-placeholder.png'}
              width={70}
              height={70 * (600 / 430)}
              alt=""
            />
          )}
          <Text fontSize={'xs'} fontWeight={'semibold'} color={'gray.500'}>
            キーカード
          </Text>
          <Button size={'xs'}>変更</Button>
        </VStack>
      </HStack>
      <Divider />
      <HStack alignItems={'flex-start'}>
        <Box flex={1} p={3}>
          <Box>
            <Text fontSize={'xs'} fontWeight={'semibold'}>
              カードリスト
            </Text>
            {diffDeckCards.length === 0 && (
              <Text fontSize={'sm'} color={'gray.600'} mt={1}>
                カードがありません
              </Text>
            )}
            <Box mt="1">
              <CardList cards={diffDeckCards} showDiff={showDiff} />
            </Box>
          </Box>
          <Box mt={8}>
            <Text fontSize={'xs'} fontWeight={'semibold'}>
              調整用カードリスト
            </Text>
            <Box mt="1">
              {diffAdjustmentCards.length === 0 && (
                <Text fontSize={'sm'} color={'gray.600'} mt={1}>
                  カードがありません
                </Text>
              )}
              <CardList cards={diffAdjustmentCards} showDiff={showDiff} />
            </Box>
          </Box>
        </Box>
        <VStack
          alignItems={'flex-start'}
          maxW={'xs'}
          borderLeft={'1px'}
          borderColor={'gray.300'}
          p={2}
          pb={10}
          spacing={2}
        >
          <HStack justifyContent={'space-between'} width={'full'}>
            <Text color={'gray.900'} fontSize={'xs'}>
              変更履歴
            </Text>
            <Checkbox
              size={'sm'}
              isChecked={showDiff}
              onChange={(event) => {
                setShowDiff(event.target.checked);
              }}
            >
              <Text fontSize={'xs'}>差分表示</Text>
            </Checkbox>
          </HStack>
          {data?.deckVersions.map((deckVersion, i) => {
            return (
              <DeckVersionCard
                key={deckVersion.id}
                deckVersion={deckVersion}
                isSelected={selectedVersion?.id === deckVersion.id}
                onPreview={() => {
                  setSelectedVersion(deckVersion);
                }}
              />
            );
          })}
        </VStack>
      </HStack>
      {/* <Button onClick={insertVersions}>Input Sample Data</Button> */}
    </Box>
  );
};

import { useGetDecksJoinDeckVersions } from '@beelzebub/deck/db';
import { getDiff } from '@beelzebub/deck/domain';
import { Deck, DeckVersion } from '@beelzebub/shared/domain';
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
import { useUser } from '@supabase/auth-helpers-react';
import d from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { KeyCardImg } from '../../components/key-card-img';
import { CardList } from './components/card-list';
import { DeckDeleteButton } from './components/deck-delete-button';
import { DeckVersionCard } from './components/deck-version-card';

export type DeckPageProps = {
  deckId: Deck['id'];
};

export const DeckPage: FC<DeckPageProps> = ({ deckId }) => {
  // hooks
  const router = useRouter();
  const user = useUser();

  // component state
  const { data, mutate } = useGetDecksJoinDeckVersions(deckId);
  const [selectedVersion, setSelectedVersion] = useState<
    DeckVersion | undefined
  >();
  const [showDiff, setShowDiff] = useState(false);
  const latestVersion: DeckVersion | undefined = useMemo(() => {
    return data?.deckVersions[0];
  }, [data?.deckVersions]);

  useEffect(() => {
    setSelectedVersion(latestVersion);
  }, [latestVersion]);

  const { cards, adjustmentCards } = useMemo(() => {
    if (data == null || selectedVersion == null) {
      return {
        cards: [],
        adjustmentCards: [],
      };
    }
    return getDiff(data, selectedVersion);
  }, [data, selectedVersion]);

  const edit = useCallback(async () => {
    router.push(`/decks/${deckId}/edit`);
  }, [deckId, router]);

  if (user == null) {
    return <Text>unauthorized</Text>;
  }

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
          <HStack alignItems={'center'} spacing={4} mt={2}>
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
            mt={2}
            spacing={0}
            alignItems={'flex-start'}
          >
            <Text>{data?.userId}</Text>
            <Text>
              {d(data?.createdAt).format('YYYY年MM月D日 HH時mm分ss秒')}
            </Text>
          </VStack>
          <HStack mt={3}>
            <Button variant={'outline'} size={'sm'} onClick={edit}>
              カードリスト編集
            </Button>
            <DeckDeleteButton
              deckId={deckId}
              onDeleted={() => {
                mutate();
              }}
            />
          </HStack>
        </Box>
        <VStack spacing={1}>
          <KeyCardImg keyCard={data?.keyCard} width={70} />
          <Text fontSize={'xs'} fontWeight={'semibold'} color={'gray.500'}>
            キーカード
          </Text>
          <Button size={'xs'}>変更</Button>
        </VStack>
      </HStack>
      <Divider borderColor={'gray.300'} />
      <HStack alignItems={'flex-start'} spacing={4}>
        <Box flex={1} p={3}>
          <Box>
            <Text fontSize={'xs'} fontWeight={'semibold'}>
              カードリスト
            </Text>
            {cards.length === 0 && (
              <Text fontSize={'sm'} color={'gray.600'} mt={1}>
                カードがありません
              </Text>
            )}
            <Box mt="1">
              <CardList cards={cards} showDiff={showDiff} />
            </Box>
          </Box>
          <Box mt={8}>
            <Text fontSize={'xs'} fontWeight={'semibold'}>
              調整用カードリスト
            </Text>
            <Box mt="1">
              {adjustmentCards.length === 0 && (
                <Text fontSize={'sm'} color={'gray.600'} mt={1}>
                  カードがありません
                </Text>
              )}
              <CardList cards={adjustmentCards} showDiff={showDiff} />
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

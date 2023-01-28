import {
  useDuplicateDeck,
  useGetDecksJoinDeckVersions,
} from '@beelzebub/deck/db';
import {
  convertToDeckDB,
  convertToDeckVersionDB,
  DeckDB,
  DeckVersionDB,
  useGetUsers,
} from '@beelzebub/shared/db';
import { Deck, DeckVersion } from '@beelzebub/shared/domain';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Heading,
  HStack,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import d from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Lock, Unlock } from 'react-feather';
import { v4 } from 'uuid';
import { KeyCardImg } from '../../components/key-card-img';
import { DeckDeleteButton } from './components/deck-delete-button';
import { DeckVersionCard } from './components/deck-version-card';
import { DeckVersionCardList } from './components/deck-version-card-list';
import { UpdateDeckKeyCardModalDialog } from './components/update-deck-key-card-modal-dialog';
import { UpdateDeckModalDialog } from './components/update-deck-modal-dialog';

export type DeckPageProps = {
  deckId: Deck['id'];
};

export const DeckPage: FC<DeckPageProps> = ({ deckId }) => {
  // hooks
  const router = useRouter();
  const user = useUser();
  const duplicateDeck = useDuplicateDeck();
  const toast = useToast();

  // component state
  const { data, mutate } = useGetDecksJoinDeckVersions(deckId);
  const { data: users } = useGetUsers();
  const [selectedVersion, setSelectedVersion] = useState<
    DeckVersion | undefined
  >();
  const [showDiff, setShowDiff] = useState(false);
  const latestVersion: DeckVersion | undefined = useMemo(() => {
    return data?.deckVersions[0];
  }, [data?.deckVersions]);
  const prevVersion: DeckVersion | undefined = useMemo(() => {
    const selectedVersionIndex = data?.deckVersions.findIndex(
      (v) => v.id === selectedVersion?.id
    );
    if (selectedVersionIndex == null || selectedVersionIndex === -1) {
      return;
    }
    const prev = data?.deckVersions[selectedVersionIndex + 1];
    return prev ?? undefined;
  }, [data?.deckVersions, selectedVersion?.id]);
  const {
    isOpen: isOpenUpdateDeckModal,
    onOpen: onOpenUpdateDeckModal,
    onClose: onCloseUpdateDeckModal,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdateKeyCardModal,
    onOpen: onOpenUpdateKeyCardModal,
    onClose: onCloseUpdateKeyCardModal,
  } = useDisclosure();
  const [isDuplicating, setDuplicating] = useState(false);

  useEffect(() => {
    setSelectedVersion(latestVersion);
  }, [latestVersion]);

  const edit = useCallback(async () => {
    router.push(`/decks/${deckId}/edit`);
  }, [deckId, router]);

  const duplicate = useCallback(async () => {
    if (data == null || user == null || latestVersion == null) {
      return;
    }
    setDuplicating(true);
    const deckDB: DeckDB = convertToDeckDB({
      ...data,
      id: v4(),
      createdAt: new Date().toISOString(),
      userId: user.id,
      name: `${data.name} コピー`,
    });
    const deckVersionDB: DeckVersionDB = convertToDeckVersionDB(latestVersion);
    await duplicateDeck(deckDB, {
      cards: deckVersionDB.cards,
      adjustment_cards: deckVersionDB.adjustment_cards,
    });
    setDuplicating(false);
    toast({
      title: 'デッキを複製しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
    router.push('/decks');
  }, [data, duplicateDeck, latestVersion, router, toast, user]);

  if (user == null) {
    return <Text>unauthorized</Text>;
  }

  return (
    <>
      <Box as="main" px="6" pt="2" pb="8">
        <HStack
          justifyContent={'space-between'}
          alignItems={'flex-start'}
          pt={2}
          pb={4}
        >
          <Box>
            <Link href="/decks">
              <Button
                size={'sm'}
                variant={'ghost'}
                leftIcon={<ArrowBackIcon />}
              >
                戻る
              </Button>
            </Link>
            <HStack alignItems={'center'} spacing={4} mt={2}>
              <HStack spacing={2}>
                <Heading as="h1" fontSize={'lg'}>
                  {data?.name}
                </Heading>
                {data?.public === false ? (
                  <Lock size={'1rem'} />
                ) : (
                  <Unlock size={'1rem'} />
                )}
              </HStack>
              <Button size={'xs'} onClick={onOpenUpdateDeckModal}>
                変更
              </Button>
            </HStack>
            <VStack
              fontSize={'sm'}
              color={'gray.600'}
              mt={2}
              spacing={0}
              alignItems={'flex-start'}
            >
              <Text>
                @
                {users?.find((v) => v.userId === data?.userId)?.name ??
                  data?.userId}
              </Text>
              <Text>
                {d(latestVersion?.createdAt).format(
                  'YYYY年MM月D日 HH時mm分ss秒'
                )}
              </Text>
            </VStack>
            <HStack mt={3}>
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={duplicate}
                disabled={isDuplicating}
              >
                {!isDuplicating ? 'デッキ複製' : <Spinner size={'sm'} />}
              </Button>
              {user.id === data?.userId && (
                <>
                  <Button variant={'outline'} size={'sm'} onClick={edit}>
                    カードリスト編集
                  </Button>
                  <DeckDeleteButton
                    deckId={deckId}
                    onDeleted={() => {
                      mutate();
                    }}
                  />
                </>
              )}
            </HStack>
          </Box>
          <VStack spacing={1}>
            <Text fontSize={'xs'} fontWeight={'semibold'} color={'gray.500'}>
              キーカード
            </Text>
            <KeyCardImg keyCard={data?.keyCard} width={70} />
            <Button size={'xs'} onClick={onOpenUpdateKeyCardModal}>
              変更
            </Button>
          </VStack>
        </HStack>
        <Divider borderColor={'gray.300'} />
        <HStack alignItems={'flex-start'} spacing={4}>
          <Box flex={1} p={3}>
            {selectedVersion != null && (
              <DeckVersionCardList
                selectedVersion={selectedVersion}
                prevVersion={prevVersion}
                showDiff={showDiff}
              />
            )}
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
                  canRestored={user.id === data.userId}
                  onPreview={() => {
                    setSelectedVersion(deckVersion);
                  }}
                  onRestored={() => {
                    mutate();
                  }}
                />
              );
            })}
          </VStack>
        </HStack>
      </Box>
      {data != null && (
        <UpdateDeckModalDialog
          deck={data}
          isOpen={isOpenUpdateDeckModal}
          onClose={() => {
            onCloseUpdateDeckModal();
            mutate();
          }}
        />
      )}
      {data != null && latestVersion != null && (
        <UpdateDeckKeyCardModalDialog
          deck={data}
          cards={latestVersion.cards}
          isOpen={isOpenUpdateKeyCardModal}
          onClose={() => {
            onCloseUpdateKeyCardModal();
            mutate();
          }}
        />
      )}
    </>
  );
};

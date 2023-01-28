import { useInsertDeckVersion } from '@beelzebub/deck/db';
import { convertToDeckVersionDB, DeckVersionDB } from '@beelzebub/shared/db';
import { DeckVersion } from '@beelzebub/shared/domain';
import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FC, memo, useCallback, useState } from 'react';
import { v4 } from 'uuid';

export const DeckVersionRestoreButton: FC<{
  deckVersioin: DeckVersion;
  onRestored?: () => void;
}> = memo(({ deckVersioin, onRestored }) => {
  const insertDeckVersion = useInsertDeckVersion();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  const restore = useCallback(async () => {
    setLoading(true);
    const deckVersionDB: DeckVersionDB = convertToDeckVersionDB({
      ...deckVersioin,
      id: v4(),
      createdAt: new Date().toISOString(),
    });
    await insertDeckVersion(deckVersionDB);
    setLoading(false);
    toast({
      title: '新しいversionとして復元しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
    onRestored?.();
    onClose();
    return;
  }, [deckVersioin, insertDeckVersion, onClose, onRestored, toast]);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button size={'xs'} colorScheme={'blue'} variant={'outline'}>
          復元
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontSize={'sm'} fontWeight={'semibold'}>
          versionを復元
        </PopoverHeader>
        <PopoverBody fontSize={'sm'}>
          <Text>versionを復元しますか？</Text>
          <Text>新しいversionとしてコミットされます。</Text>
          <HStack mt={3}>
            <Button
              colorScheme={'blue'}
              variant={'solid'}
              size={'sm'}
              disabled={isLoading}
              onClick={restore}
            >
              {!isLoading ? '復元' : <Spinner size={'sm'} />}
            </Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

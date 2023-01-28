import { Deck } from '@beelzebub/shared/domain';
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import d from 'dayjs';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';
import { useSaveDeckVersion } from '../hooks/use-save-deck-version';

export const CommitDeckVersionModalDialog: FC<{
  deckId: Deck['id'];
  isOpen: boolean;
  onClose: () => void;
}> = ({ deckId, isOpen, onClose }) => {
  const [comment, setComment] = useState(d().format('YYYY年MM月DD日 HH時mm分'));
  const [isLoading, setLoading] = useState(false);
  const saveDeckVersion = useSaveDeckVersion();
  const toast = useToast();
  const router = useRouter();

  const commit = useCallback(async () => {
    setLoading(true);
    await saveDeckVersion(deckId, comment);
    setLoading(false);
    toast({
      title: 'デッキのカードリストを更新しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
    onClose();
    router.push(`/decks/${deckId}`);
  }, [comment, deckId, onClose, router, saveDeckVersion, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>デッキ カードリスト保存</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>コメント</FormLabel>
            <Input
              type="text"
              defaultValue={comment}
              onChange={(event) => {
                setComment(event.target.value);
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            <Button colorScheme={'blue'} disabled={isLoading} onClick={commit}>
              {!isLoading ? '保存' : <Spinner size={'sm'} />}
            </Button>
            <Button colorScheme={'blue'} variant={'ghost'} onClick={onClose}>
              キャンセル
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

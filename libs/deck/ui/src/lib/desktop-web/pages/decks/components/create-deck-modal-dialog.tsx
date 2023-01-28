import { useInsertDeck } from '@beelzebub/deck/db';
import { DeckDB } from '@beelzebub/shared/db';
import { Deck } from '@beelzebub/shared/domain';
import {
  Button,
  Checkbox,
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
import { useUser } from '@supabase/auth-helpers-react';
import { FC, useCallback, useState } from 'react';
import { v4 } from 'uuid';

const usePostDeck = () => {
  const user = useUser();
  const insertDeck = useInsertDeck();
  const post = useCallback(
    async (deckName: Deck['name'], isPublic: Deck['public']) => {
      try {
        if (user == null) {
          return;
        }
        const deckId = v4();
        const deckDB: DeckDB = {
          id: deckId,
          public: isPublic,
          name: deckName,
          created_at: new Date().toISOString(),
          user_id: user.id,
        };
        await insertDeck(deckDB);
      } catch (error) {
        console.error('failed insert deck', error);
        throw error;
      }
    },
    [insertDeck, user]
  );
  return post;
};

export const CreateDeckModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isPublic, setPublic] = useState(true);
  const post = usePostDeck();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const create = useCallback(async () => {
    setLoading(true);
    await post(name, isPublic);
    setLoading(false);
    onClose();
    toast({
      title: '新しいデッキを登録しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
    return;
  }, [isPublic, name, onClose, post, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>デッキ 新規作成</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>デッキ名</FormLabel>
            <Input
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </FormControl>
          <Checkbox
            mt={4}
            isChecked={isPublic}
            onChange={(event) => {
              setPublic(event.target.checked);
            }}
          >
            公開
          </Checkbox>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            <Button
              colorScheme={'blue'}
              disabled={!name || isLoading}
              onClick={create}
            >
              {!isLoading ? '作成' : <Spinner size={'sm'} />}
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

import { useUpdateDeck } from '@beelzebub/deck/db';
import { convertToDeckDB, DeckDB } from '@beelzebub/shared/db';
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
import { FC, useCallback, useState } from 'react';

export const UpdateDeckModalDialog: FC<{
  deck: Deck;
  isOpen: boolean;
  onClose: () => void;
}> = ({ deck, isOpen, onClose }) => {
  const [name, setName] = useState(deck.name);
  const [isPublic, setPublic] = useState(deck.public);
  const updateDeck = useUpdateDeck();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const update = useCallback(async () => {
    setLoading(true);
    const upatedDeck: DeckDB = {
      ...convertToDeckDB(deck),
      name,
      public: isPublic,
    };
    await updateDeck(upatedDeck);
    setLoading(false);
    onClose();
    toast({
      title: 'デッキを更新しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
  }, [deck, isPublic, name, onClose, toast, updateDeck]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>デッキ名 編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>デッキ名</FormLabel>
            <Input
              type="text"
              defaultValue={name}
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
              onClick={update}
            >
              {!isLoading ? '更新' : <Spinner size={'sm'} />}
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

import { useGetDecksJoinLatestDeckVersion } from '@beelzebub/shared/db';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useSetDeck } from '../../hooks/use-set-deck';
import { DeckItem } from './deck-item';

export const SelectDeckModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { data: decks } = useGetDecksJoinLatestDeckVersion();
  const setDeck = useSetDeck();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>デッキ選択</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={2} alignItems={'flex-start'} w={'full'}>
            {decks?.map((deck) => {
              return (
                <DeckItem
                  key={deck.id}
                  deck={deck}
                  onSelect={() => {
                    setDeck(deck.id);
                    onClose();
                  }}
                />
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            <Button colorScheme={'blue'} variant={'ghost'} onClick={onClose}>
              キャンセル
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

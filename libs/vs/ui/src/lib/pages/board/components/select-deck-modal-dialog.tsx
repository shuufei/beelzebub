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
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { boardsState } from '../state/boards-state';

export const SelectDeckModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { data: decks } = useGetDecksJoinLatestDeckVersion();
  const [, setBoards] = useRecoilState(boardsState);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>デッキ選択</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {decks?.map((deck) => {
            return (
              <HStack key={deck.id}>
                <Text>{deck.name}</Text>
                <Button
                  onClick={() => {
                    setBoards((current) => {
                      return {
                        ...current,
                        me: {
                          ...current.me,
                          deckId: deck.id,
                        },
                      };
                    });
                  }}
                >
                  選択
                </Button>
              </HStack>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            {/* <Button
          colorScheme={'blue'}
        >
          {!isLoading ? '更新' : <Spinner size={'sm'} />}
        </Button> */}
            <Button colorScheme={'blue'} variant={'ghost'} onClick={onClose}>
              キャンセル
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

import { useUpdateDeck } from '@beelzebub/deck/db';
import { convertToDeckDB, DeckDB } from '@beelzebub/shared/db';
import { Deck, DeckVersion } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import {
  Button,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';

export const UpdateDeckKeyCardModalDialog: FC<{
  deck: Deck;
  cards: DeckVersion['cards'];
  isOpen: boolean;
  onClose: () => void;
}> = ({ deck, cards, isOpen, onClose }) => {
  const [selectedImgFileName, setSelectedImgFileName] = useState(
    deck.keyCard?.imgFileName
  );
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const updateDeck = useUpdateDeck();

  const update = useCallback(async () => {
    setLoading(true);
    const deckDB: DeckDB = convertToDeckDB(deck);
    const keyCard = cards.find((v) => v.imgFileName === selectedImgFileName);
    await updateDeck({
      ...deckDB,
      key_card: keyCard && {
        img_file_name: keyCard.imgFileName,
        category_id: keyCard.categoryId,
      },
    });
    setLoading(false);
    onClose();
    toast({
      title: 'キーカードを更新しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
  }, [cards, deck, onClose, selectedImgFileName, toast, updateDeck]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>デッキ キーカード 変更</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap spacing={3}>
            {cards.map((card) => {
              return (
                <WrapItem key={card.imgFileName}>
                  <VStack spacing={1}>
                    <CardImg
                      categoryId={card.categoryId}
                      imgFileName={card.imgFileName}
                      width={100}
                    />
                    <Checkbox
                      isChecked={selectedImgFileName === card.imgFileName}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedImgFileName(card.imgFileName);
                        }
                      }}
                    >
                      選択
                    </Checkbox>
                  </VStack>
                </WrapItem>
              );
            })}
          </Wrap>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            <Button colorScheme={'blue'} disabled={isLoading} onClick={update}>
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

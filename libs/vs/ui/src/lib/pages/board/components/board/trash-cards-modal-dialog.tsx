import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
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
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FC, memo } from 'react';

export const TrashCardsModalDialog: FC<{
  isOpen: boolean;
  cards: BoardCard[];
  onClose: () => void;
}> = memo(({ isOpen, cards, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'md'}>トラッシュ カードリスト</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap spacing={3}>
            {cards.map(({ id, card }) => {
              return (
                <WrapItem key={`${card.imgFileName}-${id}`}>
                  <VStack spacing={1}>
                    <CardImg
                      categoryId={card.categoryId}
                      imgFileName={card.imgFileName}
                      width={50}
                    />
                  </VStack>
                </WrapItem>
              );
            })}
          </Wrap>
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
});

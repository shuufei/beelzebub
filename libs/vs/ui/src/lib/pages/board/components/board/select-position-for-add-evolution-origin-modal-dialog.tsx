import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { FC, memo } from 'react';

export const SelectPositionForAddEvolutionOriginModalDialog: FC<{
  isOpen: boolean;
  card: BoardCard;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}> = memo(({ isOpen, card, onClose, onSelectIndex }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'md'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'md'}>進化元追加位置を選択</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3} pb={6}>
            {[card, ...card.evolutionOriginCards].map(({ id, card }, i) => {
              return (
                <VStack key={`${card.imgFileName}-${id}`} spacing={1}>
                  <CardImg
                    categoryId={card.categoryId}
                    imgFileName={card.imgFileName}
                    width={75}
                  />
                  <Button
                    size={'sm'}
                    variant={'outline'}
                    onClick={() => {
                      onSelectIndex(i);
                      onClose();
                    }}
                  >
                    選択
                  </Button>
                </VStack>
              );
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

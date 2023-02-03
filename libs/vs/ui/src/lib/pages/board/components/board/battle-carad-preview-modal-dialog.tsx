import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { FC, memo } from 'react';

export const BattleCardPreviewModalDialog: FC<{
  isOpen: boolean;
  card: BoardCard;
  onClose: () => void;
}> = memo(({ isOpen, card, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'md'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'md'}>トラッシュ カードリスト</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={-8} overflow={'visible'} pb={20}>
            {[card, ...card.evolutionOriginCards].map((card, i) => {
              return (
                <Box
                  key={`${card.card.imgFileName}-${card.id}`}
                  zIndex={card.evolutionOriginCards.length + 1 - i}
                  boxShadow={'2xl'}
                >
                  <CardImg
                    categoryId={card.card.categoryId}
                    imgFileName={card.card.imgFileName}
                    width={240}
                  />
                </Box>
              );
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

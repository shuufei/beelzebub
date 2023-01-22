import { Card } from '@beelzebub/shared/domain';
import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';
import { useCardImageUrl } from './hooks/use-card-image-url';

const CARD_IMG_HEIGHT = 600;
const CARD_IMG_WIDTH = 430;

export const CardPreviewModalDialog: FC<{
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}> = ({ card, isOpen, onClose }) => {
  const cardUrl = useCardImageUrl(card);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'md'}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent bg={'transparent'}>
        <Center p={1}>
          <Image
            src={cardUrl ?? '/images/card-placeholder.png'}
            width={400}
            height={400 * (CARD_IMG_HEIGHT / CARD_IMG_WIDTH)}
            alt=""
            priority={true}
          />
        </Center>
      </ModalContent>
    </Modal>
  );
};

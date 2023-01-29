import {
  Card,
  CARD_IMG_HEIGHT,
  CARD_IMG_WIDTH,
  Category,
} from '@beelzebub/shared/domain';
import { Box, useDisclosure } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';
import { CardPreviewModalDialog } from './card-preview-modal-dialog';
import { useCardImageUrl } from './hooks/use-card-image-url';

export const CardImg: FC<{
  categoryId: Category['id'];
  imgFileName: Card['imgFileName'];
  width: number;
  isEnabledPreview?: boolean;
}> = ({ categoryId, imgFileName, width, isEnabledPreview = true }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardUrl = useCardImageUrl(categoryId, imgFileName);
  return (
    <>
      <Box
        onClick={() => {
          if (!isEnabledPreview) {
            return;
          }
          onOpen();
        }}
      >
        <Image
          src={cardUrl ?? '/images/card-placeholder.png'}
          width={width}
          height={width * (CARD_IMG_HEIGHT / CARD_IMG_WIDTH)}
          alt=""
          priority={true}
        />
      </Box>
      <CardPreviewModalDialog
        categoryId={categoryId}
        imgFileName={imgFileName}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

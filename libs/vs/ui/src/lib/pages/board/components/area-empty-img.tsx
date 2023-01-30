import { Box } from '@chakra-ui/react';
import { FC, memo } from 'react';
import Image from 'next/image';
import { CARD_IMG_HEIGHT, CARD_IMG_WIDTH } from '@beelzebub/shared/domain';

export const AreaEmptyImg: FC<{ width: number; onClick?: () => void }> = memo(
  ({ width, onClick }) => {
    return (
      <Box onClick={onClick}>
        <Image
          src={'/images/card-placeholder.png'}
          width={width}
          height={width * (CARD_IMG_HEIGHT / CARD_IMG_WIDTH)}
          alt="empty"
        />
      </Box>
    );
  }
);

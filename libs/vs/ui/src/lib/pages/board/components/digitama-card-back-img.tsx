import { Box } from '@chakra-ui/react';
import { FC, memo } from 'react';
import Image from 'next/image';
import { CARD_IMG_HEIGHT, CARD_IMG_WIDTH } from '@beelzebub/shared/domain';

export const DigitamaCardBackImg: FC<{ width: number; onClick?: () => void }> =
  memo(({ width, onClick }) => {
    return (
      <Box onClick={onClick}>
        <Image
          src={'/images/back_digitama.png'}
          width={width}
          height={width * (CARD_IMG_HEIGHT / CARD_IMG_WIDTH)}
          alt="デジタマカード裏画像"
        />
      </Box>
    );
  });

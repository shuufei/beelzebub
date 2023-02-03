import { CardImg } from '@beelzebub/shared/ui';
import { Box } from '@chakra-ui/react';
import { FC, memo } from 'react';

export const DigitamaCardBackImg: FC<{ width: number; onClick?: () => void }> =
  memo(({ width, onClick }) => {
    return (
      <Box onClick={onClick}>
        <CardImg
          categoryId="_others"
          imgFileName="back_digitama.png"
          width={width}
          isEnabledPreview={false}
        />
      </Box>
    );
  });

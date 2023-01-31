import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
import { Box } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { CARD_WIDTH } from '../../constants/card-width';

export const BattleCard: FC<{ card: BoardCard }> = memo(({ card }) => {
  return (
    <Box
      transform={card.isRest ? 'rotate(90deg)' : ''}
      px={card.isRest ? '3' : ''}
    >
      <CardImg
        categoryId={card.card.categoryId}
        imgFileName={card.card.imgFileName}
        width={CARD_WIDTH}
      />
    </Box>
  );
});

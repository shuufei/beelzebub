import { CardImg } from '@beelzebub/shared/ui';
import { HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardStackOpenAreaSelector } from '../../state/selectors/board-stack-open-area-selector';

export const StackOpenArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const stackOpenArea = useRecoilValue(boardStackOpenAreaSelector(player));

  return stackOpenArea.length > 0 ? (
    <VStack spacing={1} justifyContent={'flex-end'}>
      <HStack>
        {stackOpenArea.map(({ card, id }) => {
          return (
            <CardImg
              key={id}
              categoryId={card.categoryId}
              imgFileName={card.imgFileName}
              width={CARD_WIDTH * 0.7}
            />
          );
        })}
      </HStack>
    </VStack>
  ) : null;
});

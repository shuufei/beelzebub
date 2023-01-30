import { CardImg } from '@beelzebub/shared/ui';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardSecurityOpenAreaSelector } from '../../state/selectors/board-security-open-area-selector';

export const SecurityOpenArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const securityOpenArea = useRecoilValue(
    boardSecurityOpenAreaSelector(player)
  );

  return securityOpenArea.length > 0 ? (
    <VStack spacing={1} justifyContent={'flex-start'}>
      <HStack>
        {securityOpenArea.map(({ card, id }) => {
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
  ) : (
    <Box />
  );
});

import { Box, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardSecurityAreaSelector } from '../../state/selectors/board-security-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { CardBackImg } from '../card-back-img';

export const SecurityArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const securityArea = useRecoilValue(boardSecurityAreaSelector(player));

  return (
    <VStack spacing={-12}>
      {securityArea.length > 0 ? (
        securityArea.map((card, i) => {
          return (
            <Box
              key={card.id}
              transform={'rotate(90deg)'}
              zIndex={securityArea.length - i}
            >
              <CardBackImg width={CARD_WIDTH} />
            </Box>
          );
        })
      ) : (
        <Box transform={'rotate(90deg)'}>
          <AreaEmptyImg width={CARD_WIDTH} />
        </Box>
      )}
    </VStack>
  );
});

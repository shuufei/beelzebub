import { VStack, Text } from '@chakra-ui/react';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardStackAreaSelector } from '../../state/selectors/board-stack-area-selector';
import { CardBackImg } from '../card-back-img';

export const StackArea: FC = () => {
  const player = useContext(PlayerContext);
  const stackArea = useRecoilValue(boardStackAreaSelector(player));
  return (
    <VStack spacing={1}>
      <CardBackImg width={CARD_WIDTH} />
      <Text fontSize={'xs'} fontWeight={'semibold'}>
        {stackArea.length}
      </Text>
    </VStack>
  );
};

import { VStack, Text } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useDispatcher } from '../../state/dispatcher';
import { boardStackAreaSelector } from '../../state/selectors/board-stack-area-selector';
import { CardBackImg } from '../card-back-img';

export const StackArea: FC = () => {
  const player = useContext(PlayerContext);
  const stackArea = useRecoilValue(boardStackAreaSelector(player));
  const dispatch = useDispatcher();
  const user = useUser();

  const draw = () => {
    if (player === 'opponent' || user == null) {
      return;
    }
    dispatch({
      userId: user.id,
      actionName: 'draw',
      data: undefined,
    });
  };

  return (
    <VStack spacing={1}>
      <CardBackImg width={CARD_WIDTH} onClick={draw} />
      <Text fontSize={'xs'} fontWeight={'semibold'}>
        {stackArea.length}
      </Text>
    </VStack>
  );
};

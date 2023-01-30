import { Text, VStack } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useDispatcher } from '../../state/dispatcher';
import { boardDigitamaStackAreaSelector } from '../../state/selectors/board-digitama-stack-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { DigitamaCardBackImg } from '../digitama-card-back-img';

export const DigitamaStackArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const digitamaStackArea = useRecoilValue(
    boardDigitamaStackAreaSelector(player)
  );
  const dispatch = useDispatcher();

  const draw = () => {
    if (player === 'opponent') {
      return;
    }
    dispatch('me', {
      actionName: 'draw',
      data: undefined,
    });
  };

  return (
    <VStack spacing={1}>
      {digitamaStackArea.length > 0 ? (
        <DigitamaCardBackImg width={CARD_WIDTH} onClick={draw} />
      ) : (
        <AreaEmptyImg width={CARD_WIDTH} />
      )}

      <Text fontSize={'xs'} fontWeight={'semibold'}>
        {digitamaStackArea.length}
      </Text>
    </VStack>
  );
});

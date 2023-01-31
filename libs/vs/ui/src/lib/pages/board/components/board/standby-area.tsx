import { CardImg } from '@beelzebub/shared/ui';
import { VStack } from '@chakra-ui/react';
import { last } from 'lodash';
import { FC, memo, useContext, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardStandbyAreaSelector } from '../../state/selectors/board-standby-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { BattleCard } from './battle-card';

export const StandbyArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const standbyArea = useRecoilValue(boardStandbyAreaSelector(player));
  const standbyCard = useMemo(() => {
    return last(standbyArea);
  }, [standbyArea]);
  return standbyCard != null ? (
    <BattleCard card={standbyCard} />
  ) : (
    <AreaEmptyImg width={CARD_WIDTH} />
  );
});

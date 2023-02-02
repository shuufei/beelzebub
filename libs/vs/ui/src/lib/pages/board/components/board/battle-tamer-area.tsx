import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { boardBattleTamerAreaSelector } from '../../state/selectors/board-battle-tamer-area-selector';
import { BattleCard } from './battle-card';

export const BattleTamerArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleTamer = useRecoilValue(boardBattleTamerAreaSelector(player));

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleTamer.map((card) => {
        return (
          <WrapItem key={card.id}>
            <BattleCard card={card} />
          </WrapItem>
        );
      })}
    </Wrap>
  );
});

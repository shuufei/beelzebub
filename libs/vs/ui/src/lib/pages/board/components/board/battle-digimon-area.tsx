import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { boardBattleDigimonAreaSelector } from '../../state/selectors/board-battle-digimon-area-selector';
import { BattleCard } from './battle-card';

export const BattleDigimonArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleDigimon = useRecoilValue(boardBattleDigimonAreaSelector(player));

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleDigimon.map((card) => {
        return (
          <WrapItem key={`${card.id}-${card.evolutionOriginCards.length}`}>
            <BattleCard card={card} />
          </WrapItem>
        );
      })}
    </Wrap>
  );
});

import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { boardBattleOptionAreaSelector } from '../../state/selectors/board-battle-option-area-selector';
import { BattleCard } from './battle-card';

export const BattleOptionArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleOption = useRecoilValue(boardBattleOptionAreaSelector(player));

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleOption.map((card) => {
        return (
          <WrapItem key={card.id}>
            <BattleCard card={card} />
          </WrapItem>
        );
      })}
    </Wrap>
  );
});

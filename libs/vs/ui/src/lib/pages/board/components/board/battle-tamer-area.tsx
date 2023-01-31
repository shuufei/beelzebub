import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardBattleTamerAreaSelector } from '../../state/selectors/board-battle-tamer-area-selector';
import { ActionMenu } from './actioin-menu';
import { BattleCard } from './battle-card';

export const BattleTamerArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleTamer = useRecoilValue(boardBattleTamerAreaSelector(player));

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleTamer.map((card) => {
        return (
          <WrapItem key={card.id}>
            <ActionMenu actionMenuItems={[]}>
              <BattleCard card={card} />
            </ActionMenu>
          </WrapItem>
        );
      })}
    </Wrap>
  );
});

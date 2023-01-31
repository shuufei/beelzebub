import { CardImg } from '@beelzebub/shared/ui';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardBattleOptionAreaSelector } from '../../state/selectors/board-battle-option-area-selector';
import { ActionMenu } from './actioin-menu';

export const BattleOptionArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleOption = useRecoilValue(boardBattleOptionAreaSelector(player));

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleOption.map((card) => {
        return (
          <WrapItem key={card.id}>
            <ActionMenu actionMenuItems={[]}>
              <CardImg
                categoryId={card.card.categoryId}
                imgFileName={card.card.imgFileName}
                width={CARD_WIDTH}
              />
            </ActionMenu>
          </WrapItem>
        );
      })}
    </Wrap>
  );
});

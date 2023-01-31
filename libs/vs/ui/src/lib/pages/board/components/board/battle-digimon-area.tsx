import { BoardCard } from '@beelzebub/vs/domain';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { useDispatcher } from '../../state/dispatcher';
import { boardBattleDigimonAreaSelector } from '../../state/selectors/board-battle-digimon-area-selector';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { BattleCard } from './battle-card';
import { CARD_ACTIONS } from './board-actions';

export const BattleDigimonArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleDigimon = useRecoilValue(boardBattleDigimonAreaSelector(player));
  const dispatch = useDispatcher();

  const actionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.rest,
    CARD_ACTIONS.active,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.degeneration,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
    CARD_ACTIONS.addToEvolutionOrigin,
  ];

  const onClickActionMenuItem = useCallback(
    (id: ActionMenuItem['id'], card: BoardCard) => {
      switch (id) {
        case 'rest':
          dispatch('me', {
            actionName: 'chagne-card-state',
            data: {
              card,
              newCardState: {
                isRest: true,
              },
              area: 'battleDigimon',
            },
          });
          return;
        case 'active':
          dispatch('me', {
            actionName: 'chagne-card-state',
            data: {
              card,
              newCardState: {
                isRest: false,
              },
              area: 'battleDigimon',
            },
          });
          return;
      }
    },
    [dispatch]
  );

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleDigimon.map((card) => {
        return (
          <WrapItem key={card.id}>
            <ActionMenu
              actionMenuItems={actionMenuItems}
              onClickAction={(id) => {
                onClickActionMenuItem(id, card);
              }}
            >
              <BattleCard card={card} />
            </ActionMenu>
          </WrapItem>
        );
      })}
    </Wrap>
  );
});

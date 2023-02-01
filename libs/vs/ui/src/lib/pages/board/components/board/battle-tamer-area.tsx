import { BoardCard } from '@beelzebub/vs/domain';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { actionModeState } from '../../state/action-mode-state';
import { useDispatcher } from '../../state/dispatcher';
import { boardBattleTamerAreaSelector } from '../../state/selectors/board-battle-tamer-area-selector';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { BattleCard } from './battle-card';
import { CARD_ACTIONS } from './board-actions';

export const BattleTamerArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleTamer = useRecoilValue(boardBattleTamerAreaSelector(player));
  const dispatch = useDispatcher();
  const [, setActionMode] = useRecoilState(actionModeState);

  const actionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.appear,
    CARD_ACTIONS.rest,
    CARD_ACTIONS.active,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.addToEvolutionOrigin,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
  ];

  const onClickActionMenuItem = useCallback(
    (id: ActionMenuItem['id'], card: BoardCard) => {
      switch (id) {
        case 'appear':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'battleDigimon',
              position: 'bottom',
            },
          });
          return;
        case 'rest':
          dispatch('me', {
            actionName: 'chagne-card-state',
            data: {
              card,
              newCardState: {
                isRest: true,
              },
              area: 'battleTamer',
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
              area: 'battleTamer',
            },
          });
          return;
        case 'trash':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'trash',
              position: 'bottom',
            },
          });
          return;
        case 'addToHand':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'hand',
              position: 'bottom',
              withOutEvolutionOrigins: true,
            },
          });
          return;
        case 'reverseToStackTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'stack',
              position: 'top',
              withOutEvolutionOrigins: true,
            },
          });
          return;
        case 'reverseToStackBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'stack',
              position: 'bottom',
              withOutEvolutionOrigins: true,
            },
          });
          return;
        case 'addToSecurityTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'security',
              position: 'top',
              withOutEvolutionOrigins: true,
            },
          });
          return;
        case 'addToSecurityBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleTamer',
              destArea: 'security',
              position: 'bottom',
              withOutEvolutionOrigins: true,
            },
          });
          return;
        case 'addToEvolutionOrigin':
          setActionMode({
            mode: 'addToEvolutionOrigin',
            data: {
              card,
              area: 'battleTamer',
            },
          });
          return;
      }
    },
    [dispatch, setActionMode]
  );

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleTamer.map((card) => {
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

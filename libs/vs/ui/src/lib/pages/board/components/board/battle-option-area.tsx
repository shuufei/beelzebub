import { BoardCard } from '@beelzebub/vs/domain';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { actionModeState } from '../../state/action-mode-state';
import { useDispatcher } from '../../state/dispatcher';
import { boardBattleOptionAreaSelector } from '../../state/selectors/board-battle-option-area-selector';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { BattleCard } from './battle-card';
import { CARD_ACTIONS } from './board-actions';

export const BattleOptionArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const battleOption = useRecoilValue(boardBattleOptionAreaSelector(player));
  const dispatch = useDispatcher();
  const [, setActionMode] = useRecoilState(actionModeState);

  const actionMenuItems: ActionMenuItem[] = [
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
        case 'rest':
          dispatch('me', {
            actionName: 'chagne-card-state',
            data: {
              card,
              newCardState: {
                isRest: true,
              },
              area: 'battleOption',
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
              area: 'battleOption',
            },
          });
          return;
        case 'trash':
          dispatch('me', {
            actionName: 'move',
            data: {
              card,
              srcArea: 'battleOption',
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
              srcArea: 'battleOption',
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
              srcArea: 'battleOption',
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
              srcArea: 'battleOption',
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
              srcArea: 'battleOption',
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
              srcArea: 'battleOption',
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
              area: 'battleOption',
            },
          });
          return;
      }
    },
    [dispatch, setActionMode]
  );

  return (
    <Wrap spacing={4} overflow={'visible'} justify={'center'} w={'full'}>
      {battleOption.map((card) => {
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

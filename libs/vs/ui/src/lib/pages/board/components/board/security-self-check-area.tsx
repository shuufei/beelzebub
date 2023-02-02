import { CardImg } from '@beelzebub/shared/ui';
import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { actionModeState } from '../../state/action-mode-state';
import { useDispatcher } from '../../state/dispatcher';
import { boardSecuritySelfCheckAreaSelector } from '../../state/selectors/board-security-self-check-area-selector';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { CARD_ACTIONS } from './board-actions';

export const SecuritySelfCheckArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const securitySelfCheckArea = useRecoilValue(
    boardSecuritySelfCheckAreaSelector(player)
  );

  const dispatch = useDispatcher();
  const [, setActionMode] = useRecoilState(actionModeState);

  const actionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.appear,
    CARD_ACTIONS.evolution,
    CARD_ACTIONS.addToEvolutionOrigin,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
  ];

  const onClickActionMenuItem = useCallback(
    (actionId: ActionMenuItem['id'], card: BoardCard) => {
      switch (actionId) {
        case 'appear': {
          const destArea: BoardArea =
            card.card.cardtype === 'オプション'
              ? 'battleOption'
              : card.card.cardtype === 'テイマー'
              ? 'battleTamer'
              : 'battleDigimon';
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: destArea,
              card,
              position: 'bottom',
            },
          });
          return;
        }
        case 'trash':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: 'trash',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'addToHand':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: 'hand',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'reverseToStackTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: 'stack',
              card,
              position: 'top',
            },
          });
          return;
        case 'reverseToStackBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: 'stack',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'addToSecurityTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: 'security',
              card,
              position: 'top',
            },
          });
          return;
        case 'addToSecurityBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'securitySelfCheck',
              destArea: 'security',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'evolution':
          setActionMode({
            mode: 'evolution',
            data: {
              card,
              area: 'securitySelfCheck',
            },
          });
          return;
        case 'addToEvolutionOrigin':
          setActionMode({
            mode: 'addToEvolutionOrigin',
            data: {
              card,
              area: 'securitySelfCheck',
            },
          });
          return;
      }
    },
    [dispatch, setActionMode]
  );

  const reverseToSecurity = useCallback(() => {
    securitySelfCheckArea.forEach((card) => {
      dispatch('me', {
        actionName: 'move',
        data: {
          srcArea: 'securitySelfCheck',
          destArea: 'security',
          card,
          position: 'bottom',
        },
      });
    });
    return;
  }, [dispatch, securitySelfCheckArea]);

  return securitySelfCheckArea.length > 0 && player === 'me' ? (
    <VStack spacing={2} justifyContent={'flex-start'}>
      <Text fontSize={'xs'} fontWeight={'semibold'}>
        セルフチェック
      </Text>
      <Button size={'xs'} onClick={reverseToSecurity}>
        全て元に戻す
      </Button>
      <HStack>
        {securitySelfCheckArea.map((card) => {
          return (
            <ActionMenu
              actionMenuItems={actionMenuItems}
              onClickAction={(id) => {
                onClickActionMenuItem(id, card);
              }}
            >
              <CardImg
                key={card.id}
                categoryId={card.card.categoryId}
                imgFileName={card.card.imgFileName}
                width={CARD_WIDTH}
              />
            </ActionMenu>
          );
        })}
      </HStack>
    </VStack>
  ) : (
    <Box />
  );
});

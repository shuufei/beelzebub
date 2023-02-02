import { CardImg } from '@beelzebub/shared/ui';
import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { actionModeState } from '../../state/action-mode-state';
import { useDispatcher } from '../../state/dispatcher';
import { boardStackOpenAreaSelector } from '../../state/selectors/board-stack-open-area-selector';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { CARD_ACTIONS } from './board-actions';

export const StackOpenArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const stackOpenArea = useRecoilValue(boardStackOpenAreaSelector(player));
  const dispatch = useDispatcher();
  const [, setActionMode] = useRecoilState(actionModeState);

  const actionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.appear,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.evolution,
    CARD_ACTIONS.addToEvolutionOrigin,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
  ];

  const onClickAreaAction = useCallback(
    (actionId: ActionMenuItem['id']) => {
      switch (actionId) {
        case 'trashAll':
          stackOpenArea.forEach((card) => {
            dispatch('me', {
              actionName: 'move',
              data: {
                srcArea: 'stackOpen',
                destArea: 'trash',
                card,
                position: 'bottom',
              },
            });
          });
          return;
        case 'reverseToStackBottom':
          stackOpenArea.forEach((card) => {
            dispatch('me', {
              actionName: 'move',
              data: {
                srcArea: 'stackOpen',
                destArea: 'stack',
                card,
                position: 'bottom',
              },
            });
          });
          return;
      }
    },
    [dispatch, stackOpenArea]
  );

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
              srcArea: 'stackOpen',
              destArea: destArea,
              card,
              position: 'bottom',
            },
          });
          return;
        }
        case 'addToHand':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stackOpen',
              destArea: 'hand',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'trash':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stackOpen',
              destArea: 'trash',
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
              area: 'stackOpen',
            },
          });
          return;
        case 'addToEvolutionOrigin':
          setActionMode({
            mode: 'addToEvolutionOrigin',
            data: {
              card,
              area: 'stackOpen',
            },
          });
          return;
        case 'reverseToStackTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stackOpen',
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
              srcArea: 'stackOpen',
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
              srcArea: 'stackOpen',
              destArea: 'security',
              card: card,
              position: 'top',
            },
          });
          return;
        case 'addToSecurityBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stackOpen',
              destArea: 'security',
              card: card,
              position: 'bottom',
            },
          });
          return;
      }
    },
    [dispatch, setActionMode]
  );

  return stackOpenArea.length > 0 ? (
    <VStack spacing={1} justifyContent={'flex-end'} alignItems={'flex-end'}>
      {player === 'me' && (
        <HStack justifyContent={'flex-end'}>
          <Button size={'xs'} onClick={() => onClickAreaAction('trashAll')}>
            全て破棄
          </Button>
          <Button
            size={'xs'}
            onClick={() => onClickAreaAction('reverseToStackBottom')}
          >
            全て山札の上に戻す
          </Button>
        </HStack>
      )}

      <HStack justifyContent={'flex-end'}>
        {stackOpenArea.map((card) => {
          return player === 'me' ? (
            <ActionMenu
              key={card.id}
              actionMenuItems={actionMenuItems}
              basePosition={'right'}
              onClickAction={(id) => {
                onClickActionMenuItem(id, card);
              }}
            >
              <CardImg
                categoryId={card.card.categoryId}
                imgFileName={card.card.imgFileName}
                width={CARD_WIDTH * 0.7}
              />
            </ActionMenu>
          ) : (
            <CardImg
              key={card.id}
              categoryId={card.card.categoryId}
              imgFileName={card.card.imgFileName}
              width={CARD_WIDTH * 0.7}
            />
          );
        })}
      </HStack>
    </VStack>
  ) : (
    <Box />
  );
});

import { CardImg } from '@beelzebub/shared/ui';
import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { Box, Button, useDisclosure, VStack, Wrap } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilState } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { BoardAreaContext } from '../../context/board-area-context';
import { PlayerContext } from '../../context/player-context';
import { useDispatchAddToEvolutionOrigin } from '../../hooks/use-dispatch-add-to-evolution-origin';
import { useDispatchEvolution } from '../../hooks/use-dispatch-evolution';
import { actionModeState } from '../../state/action-mode-state';
import { useDispatcher } from '../../state/dispatcher';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { CARD_ACTIONS } from './board-actions';
import { SelectPositionForAddEvolutionOriginModalDialog } from './select-position-for-add-evolution-origin-modal-dialog';

export const BattleCard: FC<{ card: BoardCard }> = memo(({ card }) => {
  const player = useContext(PlayerContext);
  const boardArea = useContext(BoardAreaContext);

  const [actionMode, setActionMode] = useRecoilState(actionModeState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatchEvolution = useDispatchEvolution();
  const dispatchAddToEvolutionOrigin = useDispatchAddToEvolutionOrigin();
  const dispatch = useDispatcher();

  const commitMode = useCallback(() => {
    if (boardArea == null) {
      throw new Error('boardArea context is undefined');
    }
    switch (actionMode.mode) {
      case 'evolution':
        dispatchEvolution(card, boardArea);
        return;
      case 'addToEvolutionOrigin':
        onOpen();
        return;
    }
  }, [actionMode.mode, boardArea, card, dispatchEvolution, onOpen]);

  const commitAddToEvolutionOrigin = useCallback(
    (index: number) => {
      if (boardArea == null) {
        return;
      }
      dispatchAddToEvolutionOrigin(card, boardArea, index);
      onClose();
    },
    [boardArea, card, dispatchAddToEvolutionOrigin, onClose]
  );

  const actionMenuItems: ActionMenuItem[] = [
    // バトルデジモンエリアのカードは登場できいない
    // バトルテイマー、バトルオプションエリアのカードはバトルデジモンエリアに登場できる
    ...(boardArea === 'battleDigimon' ? [] : [CARD_ACTIONS.appear]),
    CARD_ACTIONS.rest,
    CARD_ACTIONS.active,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.degeneration,
    CARD_ACTIONS.addToEvolutionOrigin,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
  ];

  const evolutionOriginActionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.appear,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
  ];

  const onClickActionMenuItem = useCallback(
    (
      id: ActionMenuItem['id'],
      actionCard: BoardCard,
      isEvolutionOriginCard = false
    ) => {
      if (boardArea == null) {
        return;
      }

      // 進化元カードの場合は一度tmpに移動させてからdispatchする
      // 基本的にreducerの処理の中で進化元のカードをサーチしないため
      if (isEvolutionOriginCard) {
        dispatch('me', {
          actionName: 'move-to-tmp-from-evolution-card',
          data: {
            card,
            evolutionCard: actionCard,
            area: boardArea,
          },
        });
      }
      const srcArea: BoardArea = isEvolutionOriginCard ? 'tmp' : boardArea;

      switch (id) {
        case 'rest':
          dispatch('me', {
            actionName: 'chagne-card-state',
            data: {
              card: actionCard,
              newCardState: {
                isRest: true,
              },
              area: srcArea,
            },
          });
          return;
        case 'active':
          dispatch('me', {
            actionName: 'chagne-card-state',
            data: {
              card: actionCard,
              newCardState: {
                isRest: false,
              },
              area: srcArea,
            },
          });
          return;
        case 'trash':
          dispatch('me', {
            actionName: 'move',
            data: {
              card: actionCard,
              srcArea: srcArea,
              destArea: 'trash',
              position: 'bottom',
            },
          });
          return;
        case 'addToHand':
          dispatch('me', {
            actionName: 'move',
            data: {
              card: actionCard,
              srcArea: srcArea,
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
              card: actionCard,
              srcArea: srcArea,
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
              card: actionCard,
              srcArea: srcArea,
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
              card: actionCard,
              srcArea: srcArea,
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
              card: actionCard,
              srcArea: srcArea,
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
              card: actionCard,
              area: srcArea,
            },
          });
          return;
        case 'degeneration':
          dispatch('me', {
            actionName: 'move',
            data: {
              card: actionCard,
              srcArea: srcArea,
              destArea: 'trash',
              position: 'bottom',
              withOutEvolutionOrigins: true,
            },
          });
          return;
        case 'appear':
          dispatch('me', {
            actionName: 'move',
            data: {
              card: actionCard,
              srcArea: srcArea,
              destArea: 'battleDigimon',
              position: 'bottom',
            },
          });
          return;
      }
    },
    [boardArea, card, dispatch, setActionMode]
  );

  return (
    <>
      <VStack>
        {player === 'me' ? (
          <ActionMenu
            actionMenuItems={actionMenuItems}
            onClickAction={(id) => {
              onClickActionMenuItem(id, card);
            }}
          >
            <Box
              transform={card.isRest ? 'rotate(90deg)' : ''}
              px={card.isRest ? '3' : ''}
            >
              <CardImg
                categoryId={card.card.categoryId}
                imgFileName={card.card.imgFileName}
                width={CARD_WIDTH}
              />
            </Box>
          </ActionMenu>
        ) : (
          <Box
            transform={card.isRest ? 'rotate(90deg)' : ''}
            px={card.isRest ? '3' : ''}
          >
            <CardImg
              categoryId={card.card.categoryId}
              imgFileName={card.card.imgFileName}
              width={CARD_WIDTH}
            />
          </Box>
        )}

        {card.evolutionOriginCards.length > 0 && (
          <Wrap maxWidth={CARD_WIDTH} spacing={1} overflow={'visible'}>
            {card.evolutionOriginCards.map((card) => {
              return player === 'me' ? (
                <ActionMenu
                  key={card.id}
                  actionMenuItems={evolutionOriginActionMenuItems}
                  onClickAction={(id) => {
                    onClickActionMenuItem(id, card, true);
                  }}
                >
                  <CardImg
                    categoryId={card.card.categoryId}
                    imgFileName={card.card.imgFileName}
                    width={CARD_WIDTH * 0.45}
                  />
                </ActionMenu>
              ) : (
                <CardImg
                  key={card.id}
                  categoryId={card.card.categoryId}
                  imgFileName={card.card.imgFileName}
                  width={CARD_WIDTH * 0.45}
                />
              );
            })}
          </Wrap>
        )}
        {player === 'me' && actionMode.mode !== 'none' && (
          <Button size={'xs'} variant={'outline'} onClick={commitMode}>
            選択
          </Button>
        )}
      </VStack>
      <SelectPositionForAddEvolutionOriginModalDialog
        card={card}
        isOpen={isOpen}
        onClose={onClose}
        onSelectIndex={commitAddToEvolutionOrigin}
      />
    </>
  );
});

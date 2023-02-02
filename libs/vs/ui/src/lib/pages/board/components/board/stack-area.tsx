import { Text, VStack } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useShuffleBoardArea } from '../../hooks/use-shuffle-area';
import { useDispatcher } from '../../state/dispatcher';
import { boardStackAreaSelector } from '../../state/selectors/board-stack-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { CardBackImg } from '../card-back-img';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { AREA_ACTIONS, CARD_ACTIONS } from './board-actions';

export const StackArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const stackArea = useRecoilValue(boardStackAreaSelector(player));
  const dispatch = useDispatcher();
  const shuffleArea = useShuffleBoardArea();

  const actionMenuItems: ActionMenuItem[] = [
    AREA_ACTIONS.draw,
    AREA_ACTIONS.shuffle,
    AREA_ACTIONS.openStack,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
    CARD_ACTIONS.trash,
  ];

  const onClickActionMenuItem = useCallback(
    (actionId: ActionMenuItem['id']) => {
      const stackTopCard = stackArea[0];
      switch (actionId) {
        case 'draw':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stack',
              destArea: 'hand',
              card: stackTopCard,
              position: 'bottom',
            },
          });
          return;
        case 'shuffle':
          shuffleArea('stack');
          return;
        case 'openStack':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stack',
              destArea: 'stackOpen',
              card: stackTopCard,
              position: 'bottom',
            },
          });
          return;
        case 'addToSecurityTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stack',
              destArea: 'security',
              card: stackTopCard,
              position: 'top',
            },
          });
          return;
        case 'addToSecurityBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stack',
              destArea: 'security',
              card: stackTopCard,
              position: 'bottom',
            },
          });
          return;
        case 'trash':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'stack',
              destArea: 'trash',
              card: stackTopCard,
              position: 'bottom',
            },
          });
          return;
      }
    },
    [dispatch, shuffleArea, stackArea]
  );

  return (
    <VStack spacing={1}>
      {stackArea.length > 0 ? (
        player === 'me' ? (
          <ActionMenu
            actionMenuItems={actionMenuItems}
            basePosition={'right'}
            onClickAction={(id) => {
              onClickActionMenuItem(id);
            }}
          >
            <CardBackImg
              width={CARD_WIDTH}
              onClick={() => onClickActionMenuItem('draw')}
            />
          </ActionMenu>
        ) : (
          <CardBackImg width={CARD_WIDTH} />
        )
      ) : (
        <AreaEmptyImg width={CARD_WIDTH} />
      )}

      <Text fontSize={'xs'} fontWeight={'semibold'}>
        {stackArea.length}
      </Text>
    </VStack>
  );
});

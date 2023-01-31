import { CardImg } from '@beelzebub/shared/ui';
import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useDispatcher } from '../../state/dispatcher';
import { boardHandAreaSelector } from '../../state/selectors/board-hand-area-selector';
import { CardBackImg } from '../card-back-img';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { CARD_ACTIONS } from './board-actions';

export const HandArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const handArea = useRecoilValue(boardHandAreaSelector(player));

  const dispatch = useDispatcher();

  const actionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.appear,
    CARD_ACTIONS.evolution,
    CARD_ACTIONS.trash,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
    CARD_ACTIONS.addToEvolutionOrigin,
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
              srcArea: 'hand',
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
              srcArea: 'hand',
              destArea: 'trash',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'reverseToStackTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'hand',
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
              srcArea: 'hand',
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
              srcArea: 'hand',
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
              srcArea: 'hand',
              destArea: 'security',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'evolution':
        case 'addToEvolutionOrigin':
          // TODO: mode
          return;
      }
    },
    [dispatch]
  );

  return (
    <VStack
      spacing={2}
      alignItems={'flex-start'}
      p={3}
      bg={'white'}
      border={'1px'}
      borderColor={'gray.300'}
      borderRadius={'md'}
      w={'full'}
      boxShadow={'sm'}
    >
      <HStack fontSize={'xs'} fontWeight={'semibold'}>
        <Text>手札</Text>
        <Text>({handArea.length})</Text>
      </HStack>
      <Wrap spacing={2} overflow={'visible'}>
        {handArea.map((card) => {
          return (
            <WrapItem key={card.id}>
              {player === 'me' ? (
                <ActionMenu
                  actionMenuItems={actionMenuItems}
                  onClickAction={(id) => {
                    onClickActionMenuItem(id, card);
                  }}
                >
                  <CardImg
                    categoryId={card.card.categoryId}
                    imgFileName={card.card.imgFileName}
                    width={CARD_WIDTH}
                  />
                </ActionMenu>
              ) : (
                <CardBackImg width={CARD_WIDTH * 0.5} />
              )}
            </WrapItem>
          );
        })}
      </Wrap>
    </VStack>
  );
});

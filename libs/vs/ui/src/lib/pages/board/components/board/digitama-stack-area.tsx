import { Text, VStack } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useShuffleBoardArea } from '../../hooks/use-shuffle-area';
import { useDispatcher } from '../../state/dispatcher';
import { boardDigitamaStackAreaSelector } from '../../state/selectors/board-digitama-stack-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { DigitamaCardBackImg } from '../digitama-card-back-img';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { AREA_ACTIONS } from './board-actions';

export const DigitamaStackArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const digitamaStackArea = useRecoilValue(
    boardDigitamaStackAreaSelector(player)
  );
  const dispatch = useDispatcher();
  const shuffleArea = useShuffleBoardArea();

  const actionMenuItems: ActionMenuItem[] = [
    AREA_ACTIONS.hatching,
    AREA_ACTIONS.shuffle,
  ];

  const onClickActionMenuItem = useCallback(
    (actionId: ActionMenuItem['id']) => {
      switch (actionId) {
        case 'hatching': {
          if (digitamaStackArea.length <= 0) {
            return;
          }
          const card = digitamaStackArea[0];
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'digitamaStack',
              destArea: 'standby',
              card: card,
              position: 'bottom',
            },
          });
          return;
        }
        case 'shuffle':
          shuffleArea('stack');
          return;
      }
    },
    [digitamaStackArea, dispatch, shuffleArea]
  );

  return (
    <VStack spacing={1}>
      {digitamaStackArea.length > 0 ? (
        player === 'me' ? (
          <ActionMenu
            actionMenuItems={actionMenuItems}
            onClickAction={(id) => {
              onClickActionMenuItem(id);
            }}
          >
            <DigitamaCardBackImg width={CARD_WIDTH} />
          </ActionMenu>
        ) : (
          <DigitamaCardBackImg width={CARD_WIDTH} />
        )
      ) : (
        <AreaEmptyImg width={CARD_WIDTH} />
      )}

      <Text fontSize={'xs'} fontWeight={'semibold'}>
        {digitamaStackArea.length}
      </Text>
    </VStack>
  );
});

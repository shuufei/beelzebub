import { Box, VStack } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useShuffleBoardArea } from '../../hooks/use-shuffle-area';
import { useDispatcher } from '../../state/dispatcher';
import { boardSecurityAreaSelector } from '../../state/selectors/board-security-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { CardBackImg } from '../card-back-img';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { AREA_ACTIONS } from './board-actions';

const SecurityAreaCards: FC = memo(() => {
  const player = useContext(PlayerContext);
  const securityArea = useRecoilValue(boardSecurityAreaSelector(player));

  return (
    <VStack spacing={-12}>
      {securityArea.length > 0 ? (
        securityArea.map((card, i) => {
          return (
            <Box
              key={card.id}
              transform={'rotate(90deg)'}
              zIndex={securityArea.length - i}
            >
              <CardBackImg width={CARD_WIDTH} />
            </Box>
          );
        })
      ) : (
        <Box transform={'rotate(90deg)'}>
          <AreaEmptyImg width={CARD_WIDTH} />
        </Box>
      )}
    </VStack>
  );
});

export const SecurityArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const securityArea = useRecoilValue(boardSecurityAreaSelector(player));

  const dispatch = useDispatcher();
  const shuffle = useShuffleBoardArea();

  const actionMenuItems: ActionMenuItem[] = [
    AREA_ACTIONS.shuffle,
    AREA_ACTIONS.openSecurity,
    AREA_ACTIONS.selfCheck,
  ];

  const onClickActionMenuItem = useCallback(
    (actionId: ActionMenuItem['id']) => {
      switch (actionId) {
        case 'shuffle':
          shuffle('security');
          return;
        case 'openSecurity':
          {
            if (securityArea.length === 0) {
              return;
            }
            const card = securityArea[0];
            dispatch('me', {
              actionName: 'move',
              data: {
                srcArea: 'security',
                destArea: 'securityOpen',
                card,
                position: 'bottom',
              },
            });
          }
          return;
        case 'selfCheck':
          securityArea.forEach((v) => {
            dispatch('me', {
              actionName: 'move',
              data: {
                srcArea: 'security',
                destArea: 'securitySelfCheck',
                card: v,
                position: 'bottom',
              },
            });
          });
          return;
        default:
          break;
      }
    },
    [dispatch, securityArea, shuffle]
  );

  return player === 'me' ? (
    <ActionMenu
      actionMenuItems={actionMenuItems}
      onClickAction={(id) => {
        return onClickActionMenuItem(id);
      }}
    >
      <SecurityAreaCards />
    </ActionMenu>
  ) : (
    <SecurityAreaCards />
  );
});

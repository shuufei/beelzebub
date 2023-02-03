import { CardImg } from '@beelzebub/shared/ui';
import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilState } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { actionModeState } from '../../state/action-mode-state';
import { useDispatcher } from '../../state/dispatcher';
import { ActionMenu, ActionMenuItem } from './actioin-menu';
import { CARD_ACTIONS } from './board-actions';

export const TrashCardsModalDialog: FC<{
  isOpen: boolean;
  cards: BoardCard[];
  onClose: () => void;
}> = memo(({ isOpen, cards, onClose }) => {
  const player = useContext(PlayerContext);
  const [, setActionMode] = useRecoilState(actionModeState);

  const dispatch = useDispatcher();

  const actionMenuItems: ActionMenuItem[] = [
    CARD_ACTIONS.appear,
    CARD_ACTIONS.evolution,
    CARD_ACTIONS.addToEvolutionOrigin,
    CARD_ACTIONS.addToHand,
    CARD_ACTIONS.reverseToStackTop,
    CARD_ACTIONS.reverseToStackBottom,
    CARD_ACTIONS.addToSecurityTop,
    CARD_ACTIONS.addToSecurityBottom,
    CARD_ACTIONS.reverseToDigitamaStackTop,
    CARD_ACTIONS.reverseToDigitamaStackBottom,
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
              srcArea: 'trash',
              destArea: destArea,
              card,
              position: 'bottom',
            },
          });
          return;
        }
        case 'evolution':
          setActionMode({
            mode: 'evolution',
            data: {
              card,
              area: 'trash',
            },
          });
          return;
        case 'addToHand':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'trash',
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
              srcArea: 'trash',
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
              srcArea: 'trash',
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
              srcArea: 'trash',
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
              srcArea: 'trash',
              destArea: 'security',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'reverseToDigitamaStackTop':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'trash',
              destArea: 'digitamaStack',
              card,
              position: 'top',
            },
          });
          return;
        case 'reverseToDigitamaStackBottom':
          dispatch('me', {
            actionName: 'move',
            data: {
              srcArea: 'trash',
              destArea: 'digitamaStack',
              card,
              position: 'bottom',
            },
          });
          return;
        case 'addToEvolutionOrigin':
          setActionMode({
            mode: 'addToEvolutionOrigin',
            data: {
              card,
              area: 'trash',
            },
          });
          return;
      }
    },
    [dispatch, setActionMode]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'md'}>トラッシュ カードリスト</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap spacing={3} overflow={'visible'}>
            {cards.map((card) => {
              return (
                <WrapItem key={`${card.card.imgFileName}-${card.id}`}>
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
                        width={50}
                      />
                    </ActionMenu>
                  ) : (
                    <CardImg
                      categoryId={card.card.categoryId}
                      imgFileName={card.card.imgFileName}
                      width={50}
                    />
                  )}
                </WrapItem>
              );
            })}
          </Wrap>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            <Button colorScheme={'blue'} variant={'ghost'} onClick={onClose}>
              キャンセル
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

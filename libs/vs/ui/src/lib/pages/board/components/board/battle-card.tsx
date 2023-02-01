import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
import { Box, Button, useDisclosure, VStack, Wrap } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { BoardAreaContext } from '../../context/board-area-context';
import { PlayerContext } from '../../context/player-context';
import { useDispatchAddToEvolutionOrigin } from '../../hooks/use-dispatch-add-to-evolution-origin';
import { useDispatchEvolution } from '../../hooks/use-dispatch-evolution';
import { actionModeSelector } from '../../state/selectors/actioin-mode-selector';
import { SelectPositionForAddEvolutionOriginModalDialog } from './select-position-for-add-evolution-origin-modal-dialog';

export const BattleCard: FC<{ card: BoardCard }> = memo(({ card }) => {
  const player = useContext(PlayerContext);
  const boardArea = useContext(BoardAreaContext);

  const actionMode = useRecoilValue(actionModeSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatchEvolution = useDispatchEvolution();
  const dispatchAddToEvolutionOrigin = useDispatchAddToEvolutionOrigin();

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

  return (
    <>
      <VStack>
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
        {card.evolutionOriginCards.length > 0 && (
          <Wrap maxWidth={CARD_WIDTH} spacing={1}>
            {card.evolutionOriginCards.map((card) => {
              return (
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

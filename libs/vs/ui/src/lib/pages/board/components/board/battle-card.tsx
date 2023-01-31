import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
import { Box, Button, VStack, Wrap } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useDispatchEvolution } from '../../hooks/use-dispatch-evolution';
import { actionModeSelector } from '../../state/selectors/actioin-mode-selector';

export const BattleCard: FC<{ card: BoardCard }> = memo(({ card }) => {
  const actionMode = useRecoilValue(actionModeSelector);
  const player = useContext(PlayerContext);
  const dispatchEvolution = useDispatchEvolution();

  const commitMode = useCallback(() => {
    const currentArea =
      card.card.cardtype === 'オプション'
        ? 'battleOption'
        : card.card.cardtype === 'テイマー'
        ? 'battleTamer'
        : 'battleDigimon';
    switch (actionMode.mode) {
      case 'evolution':
        dispatchEvolution(card, currentArea);
        return;
      case 'addToEvolutionOrigin':
        // TODO: select add index
        // TODO: dispatch addToEvolutionOrigin
        // TODO: reset actionMode
        return;
    }
  }, [actionMode.mode, card, dispatchEvolution]);

  return (
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
  );
});

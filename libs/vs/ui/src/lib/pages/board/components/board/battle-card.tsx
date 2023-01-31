import { CardImg } from '@beelzebub/shared/ui';
import { BoardCard } from '@beelzebub/vs/domain';
import { Box, Button, VStack, Wrap } from '@chakra-ui/react';
import { FC, memo, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { useDispatcher } from '../../state/dispatcher';
import { boardActionModeSelector } from '../../state/selectors/board-actioin-mode-selector';

export const BattleCard: FC<{ card: BoardCard }> = memo(({ card }) => {
  const actionMode = useRecoilValue(boardActionModeSelector);
  const player = useContext(PlayerContext);
  const dispatch = useDispatcher();

  const commitMode = useCallback(() => {
    dispatch('me', {
      actionName: 'commit-mode',
      data: {
        card,
        area:
          card.card.cardtype === 'オプション'
            ? 'battleOption'
            : card.card.cardtype === 'テイマー'
            ? 'battleTamer'
            : 'battleDigimon',
      },
    });
  }, [card, dispatch]);

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

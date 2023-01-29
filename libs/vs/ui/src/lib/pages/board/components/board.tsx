import { Deck } from '@beelzebub/shared/domain';
import { Box, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { memo } from 'react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../context/player-context';
import { useInitializeBoard } from '../state/mutate/use-initialize-board';
import { boardStackAreaSelector } from '../state/selectors/board-stack-area-selector';

export const Board: FC<{ deckId: Deck['id'] }> = memo(({ deckId }) => {
  const player = useContext(PlayerContext);
  useInitializeBoard(deckId, player);
  const stack = useRecoilValue(boardStackAreaSelector(player));
  return (
    <Box transform={player === 'opponent' ? 'rotate(180deg)' : ''}>
      <Text>stack: {stack.length}</Text>
      {stack.map((v) => v.card.name)}
    </Box>
  );
});

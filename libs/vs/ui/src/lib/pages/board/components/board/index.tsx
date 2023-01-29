import { Deck } from '@beelzebub/shared/domain';
import { Box } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { PlayerContext } from '../../context/player-context';
import { useInitializeBoard } from '../../state/mutate/use-initialize-board';
import { StackArea } from './stack-area';

export const Board: FC<{ deckId: Deck['id'] }> = memo(({ deckId }) => {
  const player = useContext(PlayerContext);
  useInitializeBoard(deckId, player);

  return (
    <Box transform={player === 'opponent' ? 'rotate(180deg)' : ''}>
      <StackArea />
    </Box>
  );
});

import { Deck } from '@beelzebub/shared/domain';
import { Box } from '@chakra-ui/react';
import { FC, memo, useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { PlayerContext } from '../../context/player-context';
import { dataConnectionState } from '../../state/data-connection-state';
import { useInitializeBoard } from '../../state/mutate/use-initialize-board';
import { StackArea } from './stack-area';

export const Board: FC<{ deckId: Deck['id'] }> = memo(({ deckId }) => {
  const player = useContext(PlayerContext);
  useInitializeBoard(deckId, player);
  const connection = useRecoilValue(dataConnectionState);

  useEffect(() => {
    if (connection == null || player === 'opponent') {
      return;
    }
    connection.send({
      action: 'initialize',
      data: { deckId },
    });
  }, [connection, deckId, player]);

  return (
    <Box transform={player === 'opponent' ? 'rotate(180deg)' : ''}>
      <StackArea />
    </Box>
  );
});

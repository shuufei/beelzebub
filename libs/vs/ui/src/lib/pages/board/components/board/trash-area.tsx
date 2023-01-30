import { CardImg } from '@beelzebub/shared/ui';
import { Box, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { last } from 'lodash';
import { FC, memo, useContext, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardTrashAreaSelector } from '../../state/selectors/board-trash-area-selector';
import { AreaEmptyImg } from '../area-empty-img';
import { TrashCardsModalDialog } from './trash-cards-modal-dialog';

export const TrashArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const trashArea = useRecoilValue(boardTrashAreaSelector(player));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const lastTrashedCard = useMemo(() => {
    return trashArea.length > 0 ? last(trashArea) : undefined;
  }, [trashArea]);

  return (
    <>
      <VStack spacing={1} onClick={onOpen}>
        <Box pointerEvents={'none'}>
          {lastTrashedCard != null ? (
            <CardImg
              categoryId={lastTrashedCard.card.categoryId}
              imgFileName={lastTrashedCard.card.imgFileName}
              width={CARD_WIDTH}
            />
          ) : (
            <AreaEmptyImg width={CARD_WIDTH} />
          )}
        </Box>
        <Text fontSize={'xs'} fontWeight={'semibold'}>
          {trashArea.length}
        </Text>
      </VStack>
      <TrashCardsModalDialog
        isOpen={isOpen}
        onClose={onClose}
        cards={trashArea}
      />
    </>
  );
});

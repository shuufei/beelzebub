import { CardImg } from '@beelzebub/shared/ui';
import { HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardHandAreaSelector } from '../../state/selectors/board-hand-area-selector';
import { CardBackImg } from '../card-back-img';

export const HandArea: FC = memo(() => {
  const player = useContext(PlayerContext);
  const handArea = useRecoilValue(boardHandAreaSelector(player));

  return (
    <VStack
      spacing={2}
      alignItems={'flex-start'}
      p={3}
      bg={'white'}
      border={'1px'}
      borderColor={'gray.300'}
      borderRadius={'md'}
      w={'full'}
      boxShadow={'sm'}
    >
      <HStack fontSize={'xs'} fontWeight={'semibold'}>
        <Text>手札</Text>
        <Text>({handArea.length})</Text>
      </HStack>
      <Wrap spacing={2}>
        {handArea.map(({ id, card }) => {
          return (
            <WrapItem key={id}>
              {player === 'me' ? (
                <CardImg
                  categoryId={card.categoryId}
                  imgFileName={card.imgFileName}
                  width={CARD_WIDTH}
                />
              ) : (
                <CardBackImg width={CARD_WIDTH * 0.5} />
              )}
            </WrapItem>
          );
        })}
      </Wrap>
    </VStack>
  );
});

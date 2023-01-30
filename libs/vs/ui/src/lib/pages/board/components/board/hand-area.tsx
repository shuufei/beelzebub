import { CardImg } from '@beelzebub/shared/ui';
import { HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FC, memo, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { CARD_WIDTH } from '../../constants/card-width';
import { PlayerContext } from '../../context/player-context';
import { boardHandAreaSelector } from '../../state/selectors/board-hand-area-selector';
import { CardBackImg } from '../card-back-img';
import { ActionMenu } from './actioin-menu';

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
      <Wrap spacing={2} overflow={'visible'}>
        {handArea.map((card) => {
          return (
            <WrapItem key={card.id}>
              {player === 'me' ? (
                <ActionMenu
                  actionMenuItems={[
                    {
                      id: 'appear',
                      label: '登場',
                      onClick: () => {
                        return;
                      },
                    },
                    {
                      id: 'trash',
                      label: '破棄',
                      onClick: () => {
                        return;
                      },
                    },
                    {
                      id: 'appendToEvolutionOrigin',
                      label: '進化元に追加',
                      onClick: () => {
                        return;
                      },
                    },
                  ]}
                >
                  <CardImg
                    categoryId={card.card.categoryId}
                    imgFileName={card.card.imgFileName}
                    width={CARD_WIDTH}
                  />
                </ActionMenu>
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

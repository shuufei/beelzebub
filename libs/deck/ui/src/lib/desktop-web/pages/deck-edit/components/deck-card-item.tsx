import { CardImg } from '@beelzebub/shared/ui';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { DeckCard } from '../../../domain/deck-card';
import { useAddRemoveAdjustmentDeckCard } from '../hooks/use-add-remove-adjustment-deck-card';
import { useAddRemoveDeckCard } from '../hooks/use-add-remove-deck-card';

export const DeckCardItem: FC<{ deckCard: DeckCard }> = memo(({ deckCard }) => {
  const { addDeckCard, removeDeckCard } = useAddRemoveDeckCard();
  const { addAdjustmentDeckCard } = useAddRemoveAdjustmentDeckCard();
  return (
    <VStack>
      <CardImg
        categoryId={deckCard.card.categoryId}
        imgFileName={deckCard.card.imgFileName}
        width={50}
      />
      <VStack spacing={'1'}>
        <HStack spacing={'1'}>
          <Button size={'xs'} onClick={() => removeDeckCard(deckCard.card)}>
            -
          </Button>
          <Text fontSize={'xs'}>{deckCard.count}</Text>
          <Button size={'xs'} onClick={() => addDeckCard(deckCard.card)}>
            +
          </Button>
        </HStack>
        <Button
          size={'xs'}
          onClick={() => addAdjustmentDeckCard(deckCard.card)}
        >
          調整に追加
        </Button>
      </VStack>
    </VStack>
  );
});

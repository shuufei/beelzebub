import { CardImg } from '@beelzebub/shared/ui';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { DeckCard } from '../../../domain/deck-card';
import { useAddRemoveAdjustmentDeckCard } from '../hooks/use-add-remove-adjustment-deck-card';
import { useAddRemoveDeckCard } from '../hooks/use-add-remove-deck-card';

export const AdjustmentDeckCardItem: FC<{ deckCard: DeckCard }> = memo(
  ({ deckCard }) => {
    const { addDeckCard } = useAddRemoveDeckCard();
    const { removeAdjustmentDeckCard } = useAddRemoveAdjustmentDeckCard();

    return (
      <HStack>
        <CardImg
          categoryId={deckCard.card.categoryId}
          imgFileName={deckCard.card.imgFileName}
          width={50}
        />
        <VStack spacing={'2'}>
          <Button size={'xs'} onClick={() => addDeckCard(deckCard.card)}>
            デッキに追加
          </Button>
          <Button
            size={'xs'}
            onClick={() => removeAdjustmentDeckCard(deckCard.card)}
          >
            調整から削除
          </Button>
        </VStack>
      </HStack>
    );
  }
);

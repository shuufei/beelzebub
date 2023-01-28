import { Card, DeckVersion } from '@beelzebub/shared/domain';
import { Box, Text } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { getDeckVersionDiff } from '../utils/get-deck-version-diff';
import { CardList } from './card-list';
import { CardListWithDiff } from './card-list-with-diff';

export type DiffCards = {
  added: Card[];
  removed: Card[];
};

export const DeckVersionCardList: FC<{
  selectedVersion: DeckVersion;
  prevVersion?: DeckVersion;
  showDiff?: boolean;
}> = ({ selectedVersion, prevVersion, showDiff = false }) => {
  const diff = getDeckVersionDiff(selectedVersion, prevVersion);

  const existsCards = useMemo(() => {
    return selectedVersion.cards.length !== 0;
  }, [selectedVersion.cards.length]);
  const existsAdjustmentCards = useMemo(() => {
    return selectedVersion.adjustmentCards.length !== 0;
  }, [selectedVersion.adjustmentCards.length]);

  return (
    <>
      <Box>
        <Text fontSize={'xs'} fontWeight={'semibold'}>
          カードリスト
        </Text>
        <Box mt="1">
          {!existsCards && (
            <Text fontSize={'sm'} color={'gray.600'} mt={1}>
              カードがありません
            </Text>
          )}
          {showDiff ? (
            <CardListWithDiff cardsWithDiff={diff.cards} />
          ) : (
            <CardList cardsWithCount={selectedVersion.cards} />
          )}
        </Box>
      </Box>
      <Box mt={8}>
        <Text fontSize={'xs'} fontWeight={'semibold'}>
          調整用カードリスト
        </Text>
        <Box mt="1">
          {!existsAdjustmentCards && (
            <Text fontSize={'sm'} color={'gray.600'} mt={1}>
              カードがありません
            </Text>
          )}
          {showDiff ? (
            <CardListWithDiff cardsWithDiff={diff.adjustmentCards} />
          ) : (
            <CardList
              cardsWithCount={
                selectedVersion.adjustmentCards.map((v) => ({
                  ...v,
                  count: 1,
                })) ?? []
              }
            />
          )}
        </Box>
      </Box>
    </>
  );
};

import {
  Deck,
  DeckJoinedDeckVersions,
  DeckVersion,
} from '@beelzebub/shared/domain';
import { z } from 'zod';
import { convertToDeckVersion, DeckVersionDB } from './deck-versions';
import { convertToDeck, DeckDB } from './decks';

export const DeckDBJoinedDeckVersionsDB = DeckDB.extend({
  deck_versions: z.array(DeckVersionDB),
});

export type DeckDBJoinedDeckVersionsDB = z.infer<
  typeof DeckDBJoinedDeckVersionsDB
>;

export const convertToDeckJoinedDeckVersion = (
  data: DeckDBJoinedDeckVersionsDB
): DeckJoinedDeckVersions => {
  const deck: Deck = convertToDeck({
    id: data.id,
    created_at: data.created_at,
    user_id: data.user_id,
    public: data.public,
  });
  const deckVersions: DeckVersion[] =
    data.deck_versions.map(convertToDeckVersion);
  return {
    ...deck,
    deckVersions,
  };
};

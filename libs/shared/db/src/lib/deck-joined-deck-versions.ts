import { z } from 'zod';
import { DeckVersionDB } from './deck-versions';
import { DeckDB } from './decks';

export const DeckDBJoinedDeckVersionsDB = DeckDB.extend({
  deck_versions: z.array(DeckVersionDB),
});

export type DeckDBJoinedDeckVersionsDB = z.infer<
  typeof DeckDBJoinedDeckVersionsDB
>;

import { z } from 'zod';
import { Deck } from './deck';
import { DeckVersion } from './deck-version';

export const DeckJoinedDeckVersions = Deck.extend({
  deckVersions: z.array(DeckVersion),
});

export type DeckJoinedDeckVersions = z.infer<typeof DeckJoinedDeckVersions>;

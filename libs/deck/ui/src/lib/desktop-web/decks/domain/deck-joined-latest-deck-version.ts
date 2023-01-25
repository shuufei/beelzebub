import { Deck, DeckVersion } from '@beelzebub/shared/domain';

export type DeckJoinedLatestDeckVersion = Deck & {
  latestDeckVersion: DeckVersion;
};

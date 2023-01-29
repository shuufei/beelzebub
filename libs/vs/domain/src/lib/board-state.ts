import { Deck } from '@beelzebub/shared/domain';
import { BoardArea } from './board-area';
import { BoardCard } from './board-card';

export type BoardState = {
  [area in BoardArea]: BoardCard[];
} & { deckId?: Deck['id'] };

export const INITIALI_BOARD_STATE: BoardState = {
  deckId: undefined,
  stack: [],
  trash: [],
  hand: [],
  security: [],
  digitamaStack: [],
  standby: [],
  stackOpen: [],
  securityOpen: [],
  securitySelfCheck: [],
  battleDigimon: [],
  battleTamer: [],
  battleOption: [],
};

import { BoardArea } from './board-area';
import { BoardCard } from './board-card';

export type BoardState = {
  [area in BoardArea]: BoardCard[];
};

export const INITIALI_BOARD_STATE: BoardState = {
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
  tmp: [],
};

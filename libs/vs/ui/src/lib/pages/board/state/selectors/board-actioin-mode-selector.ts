import { selector } from 'recoil';
import { boardsState } from '../boards-state';

export const boardActionModeSelector = selector({
  key: 'boardActionModeSelector',
  get: ({ get }) => {
    return get(boardsState).actionMode;
  },
});

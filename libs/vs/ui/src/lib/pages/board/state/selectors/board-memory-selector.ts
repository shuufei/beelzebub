import { selector } from 'recoil';
import { boardsState } from '../boards-state';

export const boardMemorySelector = selector({
  key: 'boardMemorySelector',
  get: ({ get }) => {
    return get(boardsState).memory;
  },
});

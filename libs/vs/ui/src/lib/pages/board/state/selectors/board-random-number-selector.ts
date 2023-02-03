import { selector } from 'recoil';
import { boardsState } from '../boards-state';

export const boardRandomNumberSelector = selector({
  key: 'boardRandomNumberSelector',
  get: ({ get }) => {
    return get(boardsState).randomNumber;
  },
});

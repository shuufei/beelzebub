import { selector } from 'recoil';
import { actionModeState } from '../action-mode-state';

export const actionModeSelector = selector({
  key: 'actionModeSelector',
  get: ({ get }) => {
    return get(actionModeState);
  },
});

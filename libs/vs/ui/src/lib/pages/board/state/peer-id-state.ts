import { atom } from 'recoil';

export const peerIdState = atom<string | undefined>({
  key: 'peerIdState',
  default: undefined,
});

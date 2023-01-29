import { atom } from 'recoil';
import Peer from 'skyway-js';

export const peerState = atom<Peer | undefined>({
  key: 'peerState',
  default: undefined,
  dangerouslyAllowMutability: true,
});

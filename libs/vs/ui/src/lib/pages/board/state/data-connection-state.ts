import { atom } from 'recoil';
import { DataConnection } from 'skyway-js';

export const dataConnectionState = atom<DataConnection | undefined>({
  key: 'dataConnectionState',
  default: undefined,
  dangerouslyAllowMutability: true,
});

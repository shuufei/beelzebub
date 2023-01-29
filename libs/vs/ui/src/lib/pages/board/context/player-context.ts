import { Player } from '@beelzebub/vs/domain';
import { createContext } from 'react';

export const PlayerContext = createContext<Player>('me');

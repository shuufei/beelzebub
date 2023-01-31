import { BoardArea } from '@beelzebub/vs/domain';
import { createContext } from 'react';

export const BoardAreaContext = createContext<BoardArea | undefined>(undefined);

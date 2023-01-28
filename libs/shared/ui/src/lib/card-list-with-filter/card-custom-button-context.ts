import { Card } from '@beelzebub/shared/domain';
import { createContext } from 'react';

export const CardCustomButtonContext = createContext<
  { label: string; onClick: (card: Card) => void } | undefined
>(undefined);

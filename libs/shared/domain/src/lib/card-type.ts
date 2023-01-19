import { z } from 'zod';

export const CardType = z.union([
  z.literal('デジタマ'),
  z.literal('デジモン'),
  z.literal('テイマー'),
  z.literal('オプション'),
]);

export type CardType = z.infer<typeof CardType>;

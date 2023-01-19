import { z } from 'zod';

export const Lv = z.union([
  z.literal('Lv.2'),
  z.literal('Lv.3'),
  z.literal('Lv.4'),
  z.literal('Lv.5'),
  z.literal('Lv.6'),
  z.literal('Lv.7'),
  z.literal('-'),
]);

export type Lv = z.infer<typeof Lv>;

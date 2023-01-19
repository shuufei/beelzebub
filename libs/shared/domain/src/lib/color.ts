import { z } from 'zod';

export const Color = z.union([
  z.literal('red'),
  z.literal('blue'),
  z.literal('green'),
  z.literal('yellow'),
  z.literal('black'),
  z.literal('purple'),
  z.literal('white'),
]);

export type Color = z.infer<typeof Color>;

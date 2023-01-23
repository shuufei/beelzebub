import { z } from 'zod';

export const CardOriginal = z.object({
  no: z.string(),
  lv: z.string().optional(),
  rarity: z.string(),
  cardtype: z.string(),
  parallel: z.string().optional(),
  name: z.string(),
  color: z.string(),
  imgFileName: z.string(),
  form: z.string().optional(),
  attribute: z.string(),
  type: z.string(),
  dp: z.string().optional(),
  appearanceCost: z.string().optional(),
  evolutionCost1: z.string().optional(),
  evolutionCost2: z.string().optional(),
  effect: z.string().optional(),
  evolutionaryOriginEffect: z.string().optional(),
  securityEffect: z.string().optional(),
});

export type CardOriginal = z.infer<typeof CardOriginal>;

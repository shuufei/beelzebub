import { z } from 'zod';

export const CardOriginal = z.object({
  no: z.string(),
  lv: z.union([z.string(), z.undefined()]),
  rarity: z.string(),
  cardtype: z.string(),
  parallel: z.union([z.string(), z.undefined()]),
  name: z.string(),
  color: z.string(),
  imgFileName: z.string(),
  form: z.union([z.string(), z.undefined()]),
  attribute: z.string(),
  type: z.string(),
  dp: z.union([z.string(), z.undefined()]),
  appearanceCost: z.union([z.string(), z.undefined()]),
  evolutionCost1: z.union([z.string(), z.undefined()]),
  evolutionCost2: z.union([z.string(), z.undefined()]),
  effect: z.union([z.string(), z.undefined()]),
  evolutionaryOriginEffect: z.union([z.string(), z.undefined()]),
  securityEffect: z.union([z.string(), z.undefined()]),
});

export type CardOriginal = z.infer<typeof CardOriginal>;

import { z } from 'zod';
import { CardType } from './card-type';
import { Lv } from './lv';
import { Color } from './color';

export const Card = z.object({
  no: z.string(),
  lv: z.union([Lv, z.undefined()]),
  rarity: z.string(),
  cardtype: CardType,
  parallel: z.boolean(),
  name: z.string(),
  colors: z.array(Color),
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
  imgFileName: z.string(),
  category: z.string(),
});

export type Card = z.infer<typeof Card>;

import { z } from 'zod';
import { CardType } from './card-type';
import { Lv } from './lv';
import { Color } from './color';
import { Category } from './category';

export const Card = z.object({
  no: z.string(),
  lv: Lv.optional(),
  rarity: z.string(),
  cardtype: CardType,
  parallel: z.boolean(),
  name: z.string(),
  colors: z.array(Color),
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
  imgFileName: z.string(),
  categoryId: Category.shape.id,
  createdAt: z.string(),
});

export type Card = z.infer<typeof Card>;

export const CARD_IMG_HEIGHT = 600;
export const CARD_IMG_WIDTH = 430;

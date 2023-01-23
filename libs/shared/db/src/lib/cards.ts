import { Card, CardType, Color, Lv } from '@beelzebub/shared/domain';
import { z } from 'zod';
import { CategoryDB } from './categories';

export const CardDB = z.object({
  img_file_name: z.string(),
  created_at: z.string(),
  no: z.string(),
  lv: z.string(),
  rarity: z.string(),
  cardtype: z.string(),
  parallel: z.boolean(),
  name: z.string(),
  colors: z.array(z.string()),
  form: z.string().optional(),
  attribute: z.string(),
  type: z.string(),
  dp: z.string().optional(),
  appearance_cost: z.string().optional(),
  evolution_cost1: z.string().optional(),
  evolution_cost2: z.string().optional(),
  effect: z.string().optional(),
  evolutionary_origin_effect: z.string().optional(),
  security_effect: z.string().optional(),
  category_id: CategoryDB.shape.id,
});

export type CardDB = z.infer<typeof CardDB>;

export const convertToCard = (data: CardDB): Card => {
  return {
    no: data.no,
    imgFileName: data.img_file_name,
    lv: Lv.parse(data.lv),
    rarity: data.rarity,
    cardtype: CardType.parse(data.cardtype),
    parallel: data.parallel,
    name: data.name,
    colors: z.array(Color).parse(data.colors),
    form: data.form,
    attribute: data.attribute,
    type: data.type,
    dp: data.dp,
    appearanceCost: data.appearance_cost,
    evolutionCost1: data.evolution_cost1,
    evolutionCost2: data.evolution_cost2,
    effect: data.effect,
    evolutionaryOriginEffect: data.evolutionary_origin_effect,
    securityEffect: data.security_effect,
    categoryId: data.category_id,
  };
};

import { z } from 'zod';
import { Card } from './card';
import { CardOriginal } from './card-original';
import { CardType } from './card-type';
import { Color } from './color';
import { Lv } from './lv';

const convertColorsFromOriginalColor = (
  original: CardOriginal['color']
): Card['colors'] => {
  const isMultiColor = original.includes('multicolor');
  const colors = isMultiColor ? original.split(' ')[0].split('_') : [original];
  const parsed = z.array(Color).parse(colors);
  return parsed;
};

export const convertCardFromOriginal = (
  original: CardOriginal,
  categoryId: Card['categoryId']
): Card => {
  const parsedLv = Lv.parse(original.lv ?? '-');
  const parsdCardType = CardType.parse(original.cardtype);
  const parsedColors = convertColorsFromOriginalColor(original.color);
  const card: Card = {
    no: original.no,
    lv: parsedLv,
    rarity: original.rarity,
    cardtype: parsdCardType,
    parallel: !!original.parallel,
    name: original.name,
    colors: parsedColors,
    form: original.form,
    attribute: original.attribute,
    type: original.type,
    dp: original.dp,
    appearanceCost: original.appearanceCost,
    evolutionCost1: original.evolutionCost1,
    evolutionCost2: original.evolutionCost2,
    effect: original.effect,
    evolutionaryOriginEffect: original.evolutionaryOriginEffect,
    securityEffect: original.securityEffect,
    imgFileName: original.imgFileName,
    categoryId,
  };
  return card;
};

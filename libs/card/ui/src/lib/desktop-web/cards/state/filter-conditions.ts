import { CardType, Color, Lv } from '@beelzebub/shared/domain';
import { atom, selector } from 'recoil';

export type ColorsCondition = { [key in Color]: boolean };
export type LvCondition = { [key in Lv]: boolean };
export type CardTypeCondition = { [key in CardType]: boolean };
export type CategoryCondition = { [key: string]: boolean };
export type FilterCondition = {
  color: ColorsCondition;
  lv: LvCondition;
  cardType: CardTypeCondition;
  includeParallel: boolean;
  category: CategoryCondition;
  name: string;
};

export const filterConditionState = atom<FilterCondition>({
  key: 'filterConditionState',
  default: {
    color: {
      red: true,
      blue: true,
      green: true,
      yellow: true,
      black: true,
      purple: true,
      white: true,
    },
    lv: {
      '-': true,
      'Lv.2': true,
      'Lv.3': true,
      'Lv.4': true,
      'Lv.5': true,
      'Lv.6': true,
      'Lv.7': true,
    },
    cardType: {
      デジモン: true,
      デジタマ: true,
      テイマー: true,
      オプション: true,
    },
    includeParallel: true,
    category: {},
    name: '',
  },
});

export const colorFilterConditionState = selector({
  key: 'colorFilterConditionState',
  get: ({ get }) => {
    const condition = get(filterConditionState);
    return condition.color;
  },
});

export const lvFilterConditionState = selector({
  key: 'lvFilterConditionState',
  get: ({ get }) => {
    const condition = get(filterConditionState);
    return condition.lv;
  },
});

export const cardTypeFilterConditionState = selector({
  key: 'cardTypeFilterConditionState',
  get: ({ get }) => {
    const condition = get(filterConditionState);
    return condition.cardType;
  },
});

export const includeParallelConditionState = selector({
  key: 'includeParallelConditionState',
  get: ({ get }) => {
    const condition = get(filterConditionState);
    return condition.includeParallel;
  },
});

export const categoryFilterConditionState = selector({
  key: 'categoryFilterConditionState',
  get: ({ get }) => {
    const condition = get(filterConditionState);
    return condition.category;
  },
});

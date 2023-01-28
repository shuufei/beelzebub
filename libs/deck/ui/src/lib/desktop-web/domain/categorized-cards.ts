import { Card } from '@beelzebub/shared/domain';

export type CategorizedCards<T = Card> = {
  digitama: T[];
  LvNone: T[];
  Lv3: T[];
  Lv4: T[];
  Lv5: T[];
  Lv6: T[];
  Lv7: T[];
  tamer: T[];
  option: T[];
};

export const categorizeCards = (cards: Card[]): CategorizedCards => {
  const init: CategorizedCards = {
    digitama: [],
    LvNone: [],
    Lv3: [],
    Lv4: [],
    Lv5: [],
    Lv6: [],
    Lv7: [],
    tamer: [],
    option: [],
  };
  return cards.reduce((acc, curr) => {
    const tmp = { ...acc };
    if (curr.cardtype === 'デジタマ') {
      tmp.digitama = [...tmp.digitama, curr];
    } else if (curr.cardtype === 'テイマー') {
      tmp.tamer = [...tmp.tamer, curr];
    } else if (curr.cardtype === 'オプション') {
      tmp.option = [...tmp.option, curr];
    } else if (curr.lv === 'Lv.3') {
      tmp.Lv3 = [...tmp.Lv3, curr];
    } else if (curr.lv === 'Lv.4') {
      tmp.Lv4 = [...tmp.Lv4, curr];
    } else if (curr.lv === 'Lv.5') {
      tmp.Lv5 = [...tmp.Lv5, curr];
    } else if (curr.lv === 'Lv.6') {
      tmp.Lv6 = [...tmp.Lv6, curr];
    } else if (curr.lv === 'Lv.7') {
      tmp.Lv7 = [...tmp.Lv7, curr];
    } else if (curr.lv === '-' && curr.cardtype === 'デジモン') {
      tmp.LvNone = [...tmp.LvNone, curr];
    }
    return tmp;
  }, init);
};

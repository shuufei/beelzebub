import { CategorizedCards } from '@beelzebub/shared/domain';
import { DeckCard } from './deck-card';

export type CategorizedDeckCards = CategorizedCards<DeckCard>;

export const categorizeDeckCards = (
  deckCards: DeckCard[]
): CategorizedDeckCards => {
  const init: CategorizedDeckCards = {
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
  return deckCards.reduce((acc, curr) => {
    const tmp = { ...acc };
    if (curr.card.cardtype === 'デジタマ') {
      tmp.digitama = [...tmp.digitama, curr];
    } else if (curr.card.cardtype === 'テイマー') {
      tmp.tamer = [...tmp.tamer, curr];
    } else if (curr.card.cardtype === 'オプション') {
      tmp.option = [...tmp.option, curr];
    } else if (curr.card.lv === 'Lv.3') {
      tmp.Lv3 = [...tmp.Lv3, curr];
    } else if (curr.card.lv === 'Lv.4') {
      tmp.Lv4 = [...tmp.Lv4, curr];
    } else if (curr.card.lv === 'Lv.5') {
      tmp.Lv5 = [...tmp.Lv5, curr];
    } else if (curr.card.lv === 'Lv.6') {
      tmp.Lv6 = [...tmp.Lv6, curr];
    } else if (curr.card.lv === 'Lv.7') {
      tmp.Lv7 = [...tmp.Lv7, curr];
    } else if (curr.card.lv === '-' && curr.card.cardtype === 'デジモン') {
      tmp.LvNone = [...tmp.LvNone, curr];
    }
    return tmp;
  }, init);
};

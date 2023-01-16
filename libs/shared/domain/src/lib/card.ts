export type Card = {
  no: string;
  lv?: Lv;
  rarity: string;
  cardtype: CardType;
  parallel?: string;
  name: string;
  colors: Color[];
  color: string;
  form?: string;
  attribute: string;
  type: string;
  dp?: string;
  apperanceCost?: string;
  evolutionCost1?: string;
  evolutionCost2?: string;
  effect?: string;
  evolutionaryOriginEffect?: string;
  securityEffect?: string;
  imgFileName: string;
  category: string;
};

export const LV = {
  'Lv.2': 'Lv.2',
  'Lv.3': 'Lv.3',
  'Lv.4': 'Lv.4',
  'Lv.5': 'Lv.5',
  'Lv.6': 'Lv.6',
  'Lv.7': 'Lv.7',
  '-': '-',
} as const;

export type Lv = keyof typeof LV;

export const CARD_TYPE = {
  デジタマ: 'デジタマ',
  デジモン: 'デジモン',
  テイマー: 'テイマー',
  オプション: 'オプション',
} as const;

export type CardType = keyof typeof CARD_TYPE;

export type ApiResponseColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'black'
  | 'purple'
  | 'white';

export const COLOR = {
  '1_red': '1_red',
  '2_blue': '2_blue',
  '3_yellow': '3_yellow',
  '4_green': '4_green',
  '5_black': '5_black',
  '6_purple': '6_purple',
  '7_white': '7_white',
  '8_multicolor': '8_multicolor',
} as const;

export type Color = keyof typeof COLOR;

export const convertToDisplayColorFromColor = (color: Color): string => {
  switch (color) {
    case '1_red':
      return '赤';
    case '2_blue':
      return '青';
    case '3_yellow':
      return '黄';
    case '4_green':
      return '緑';
    case '5_black':
      return '黒';
    case '6_purple':
      return '紫';
    case '7_white':
      return '白';
    default:
      return '-';
  }
};

export const convertToColorCodeFromColor = (color: Color): string => {
  switch (color) {
    case '1_red':
      return '#e7052c';
    case '2_blue':
      return '#2697e1';
    case '3_yellow':
      return '#fde105';
    case '4_green':
      return '#2a9b69';
    case '5_black':
      return '#211715';
    case '6_purple':
      return '#6356a3';
    case '7_white':
      return '#ffffff';
    default:
      return '#a0a0a0';
  }
};

// export const convertToDisplayCardTypeFromCardType = (
//   cardType: CardType
// ): string => {
//   switch (cardType) {
//     case '1_デジタマ':
//       return 'デジタマ';
//     case '2_デジモン':
//       return 'デジモン';
//     case '3_テイマー':
//       return 'テイマー';
//     case '4_オプション':
//       return 'オプション';
//     default:
//       return '-';
//   }
// };

export const convertToDisplayDigimonLvFromDigimonLv = (lv: Lv): string => {
  switch (lv) {
    case '-':
      return 'None';
    default:
      return lv;
  }
};

export const CATEGORY = {
  BT01: 'BT01',
  BT02: 'BT02',
  BT03: 'BT03',
  BT04: 'BT04',
  BT05: 'BT05',
  BT06: 'BT06',
  BT07: 'BT07',
  BT08: 'BT08',
  BT09: 'BT09',
  BT10: 'BT10',
  BT11: 'BT11',
  EX01: 'EX01',
  EX02: 'EX02',
  EX03: 'EX03',
  ST01: 'ST01',
  ST02: 'ST02',
  ST03: 'ST03',
  ST04: 'ST04',
  ST05: 'ST05',
  ST06: 'ST06',
  ST07: 'ST07',
  ST08: 'ST08',
  ST09: 'ST09',
  ST10: 'ST10',
  ST11: 'ST11',
  ST12: 'ST12',
  ST13: 'ST13',
  PRO: 'PRO',
} as const;

export type Category = keyof typeof CATEGORY;

export const convertToDisplayCategoryFromCategory = (
  category: Category
): string => {
  switch (category) {
    case 'BT01':
      return 'BT-01 NEW EVOLUTION';
    case 'BT02':
      return 'BT-02 ULTIMATE POWER';
    case 'BT03':
      return 'BT-03 ユニオンインパクト';
    case 'BT04':
      return 'BT-04 グレイトレジェンド';
    case 'BT05':
      return 'BT-05 バトルオブオメガ';
    case 'BT06':
      return 'BT-06 ダブルダイヤモンド';
    case 'BT07':
      return 'BT-07 ネクストアドベンチャー';
    case 'BT08':
      return 'BT-08 ニューヒーロー';
    case 'BT09':
      return 'BT-09 Xレコード';
    case 'BT10':
      return 'BT-10 クロスエンカウンター';
    case 'BT11':
      return 'BT-11 ディメンショナルフェイズ';
    case 'EX01':
      return 'EX-01 クラシックコレクション';
    case 'EX02':
      return 'EX-02 デジタルハザード';
    case 'EX03':
      return 'EX-03 ドラゴンズロア';
    case 'ST01':
      return 'ST-01 ガイアレッド';
    case 'ST02':
      return 'ST-02 コキュートブルー';
    case 'ST03':
      return 'ST-03 ヘブンズイエロー';
    case 'ST04':
      return 'ST-04 ギガグリーン';
    case 'ST05':
      return 'ST-05 ムゲンブラック';
    case 'ST06':
      return 'ST-06 ヴェノムヴァイオレット';
    case 'ST07':
      return 'ST-07 デュークモン';
    case 'ST08':
      return 'ST-08 アルフォースドラモン';
    case 'ST09':
      return 'ST-09 究極の古代竜';
    case 'ST10':
      return 'ST-10 異世界の軍師';
    case 'ST11':
      return 'ST-11 スペシャルエントリーセット';
    case 'ST12':
      return 'ST-12 ジエスモン';
    case 'ST13':
      return 'ST-13 ラグナロードモン';
    case 'PRO':
      return 'PRO プロモーション';
    default:
      return category;
  }
};

export const colorList = Object.entries(COLOR)
  .map((v) => v[0] as Color)
  .filter((v) => v !== '8_multicolor');

export const cardTypeList: CardType[] = Object.entries(CARD_TYPE).map(
  (v) => v[0] as CardType
);

export const lvList: Lv[] = Object.entries(LV).map((v) => v[0] as Lv);

export const categoryList: Category[] = Object.entries(CATEGORY).map(
  (v) => v[0] as Category
);

export const cardImageAspectRate = 1.395;

export type CardsGroupedByNo = {
  [imageFileName: string]: {
    card: Card;
    count: number;
  };
};

export type CardsGropedByLvAndCardType = {
  'Lv.2': Card[];
  'Lv.3': Card[];
  'Lv.4': Card[];
  'Lv.5': Card[];
  'Lv.6': Card[];
  'Lv.7': Card[];
  '-': Card[];
  '3_テイマー': Card[];
  '4_オプション': Card[];
};

export type CardsGroupedByLvAndCardTypeAndNo = {
  [key in keyof CardsGropedByLvAndCardType]: CardsGroupedByNo;
};

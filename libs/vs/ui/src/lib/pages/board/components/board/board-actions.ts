import { ActionMenuItem, AreaAction, CardAction } from './actioin-menu';

export const CARD_ACTIONS: {
  [key in CardAction]: ActionMenuItem;
} = {
  appear: {
    id: 'appear',
    label: '登場',
  },
  evolution: {
    id: 'evolution',
    label: '進化',
  },
  rest: {
    id: 'rest',
    label: 'レスト',
  },
  active: {
    id: 'active',
    label: 'アクティブ',
  },
  trash: {
    id: 'trash',
    label: '破棄',
  },
  addToHand: {
    id: 'addToHand',
    label: '手札に加える',
  },
  reverseToStackTop: {
    id: 'reverseToStackTop',
    label: '山札の上に戻す',
  },
  reverseToStackBottom: {
    id: 'reverseToStackBottom',
    label: '山札の下に戻す',
  },
  degeneration: {
    id: 'degeneration',
    label: '退化',
  },
  addToSecurityTop: {
    id: 'addToSecurityTop',
    label: 'セキュリティの上に追加',
  },
  addToSecurityBottom: {
    id: 'addToSecurityBottom',
    label: 'セキュリティの下に戻す',
  },
  addToEvolutionOrigin: {
    id: 'addToEvolutionOrigin',
    label: '進化元に追加',
  },
  reverseToDigitamaStackTop: {
    id: 'reverseToDigitamaStackTop',
    label: 'デジタマ山札の上に戻す',
  },
  reverseToDigitamaStackBottom: {
    id: 'reverseToDigitamaStackBottom',
    label: 'デジタマ山札の下に戻す',
  },
};

export const AREA_ACTIONS: {
  [key in AreaAction]: ActionMenuItem;
} = {
  shuffle: {
    id: 'shuffle',
    label: 'シャッフル',
  },
  openStack: {
    id: 'openStack',
    label: '山札をオープン',
  },
  draw: {
    id: 'draw',
    label: 'ドロー',
  },
  recovery: {
    id: 'recovery',
    label: 'リカバリー',
  },
  selfCheck: {
    id: 'selfCheck',
    label: 'セルフチェック',
  },
  reverseToOriginalLocation: {
    id: 'reverseToOriginalLocation',
    label: '元の場所に戻す',
  },
  hatching: {
    id: 'hatching',
    label: '孵化',
  },
  restAll: {
    id: 'restAll',
    label: '全てレスト',
  },
  activeAll: {
    id: 'activeAll',
    label: '全てアクティブ',
  },
  trashAll: {
    id: 'trashAll',
    label: '全て破棄',
  },
};

import { DeckVersionDB } from '@beelzebub/shared/db';
import { v4 } from 'uuid';

export const SAMPLE_DATA_CARDS: DeckVersionDB['cards'] = [
  {
    img_file_name: 'BT2-068.png',
    category_id: '503002',
    count: 4,
  },
  {
    img_file_name: 'EX2-039.png',
    category_id: '503010',
    count: 4,
  },
  {
    img_file_name: 'ST14-03.png',
    category_id: '503114',
    count: 4,
  },
  {
    img_file_name: 'EX2-071.png',
    category_id: '503010',
    count: 3,
  },
  {
    img_file_name: 'BT7-109.png',
    category_id: '503008',
    count: 3,
  },
  {
    img_file_name: 'BT2-090.png',
    category_id: '503002',
    count: 3,
  },
  {
    img_file_name: 'EX2-074_P1.png',
    category_id: '503010',
    count: 2,
  },
  {
    img_file_name: 'BT2-111.png',
    category_id: '503002',
    count: 4,
  },
  {
    img_file_name: 'BT7-111_P1.png',
    category_id: '503008',
    count: 4,
  },
  {
    img_file_name: 'BT4-115_P1.png',
    category_id: '503004',
    count: 4,
  },
];
export const SAMPLE_DATA_VERSIONS: DeckVersionDB[] = [
  {
    id: v4(),
    created_at: new Date('2023-01-23T10:00:00+0900').toISOString(),
    deck_id: 'bc25f4b3-15a7-4760-bd9e-4ca45d4bef1d',
    cards: SAMPLE_DATA_CARDS,
    adjustment_cards: [
      {
        img_file_name: 'EX2-074_P1.png',
        category_id: '503002',
        count: 2,
      },
    ],
    user_id: '07f26858-ca75-457e-85a8-803ce90cd43d',
    comment: '初版',
  },
  {
    id: v4(),
    created_at: new Date('2023-01-23T10:11:00+0900').toISOString(),
    deck_id: 'bc25f4b3-15a7-4760-bd9e-4ca45d4bef1d',
    cards: [
      {
        img_file_name: 'BT2-068.png',
        category_id: '503002',
        count: 3,
      },
      {
        img_file_name: 'EX2-039.png',
        category_id: '503010',
        count: 3,
      },
      {
        img_file_name: 'ST14-03.png',
        category_id: '503114',
        count: 4,
      },
      {
        img_file_name: 'EX2-071.png',
        category_id: '503010',
        count: 3,
      },
      {
        img_file_name: 'BT7-109.png',
        category_id: '503008',
        count: 3,
      },
      {
        img_file_name: 'BT2-090.png',
        category_id: '503002',
        count: 3,
      },
      {
        img_file_name: 'EX2-074_P1.png',
        category_id: '503010',
        count: 2,
      },
      {
        img_file_name: 'BT2-111.png',
        category_id: '503002',
        count: 4,
      },
      {
        img_file_name: 'BT7-111_P1.png',
        category_id: '503008',
        count: 4,
      },
      {
        img_file_name: 'BT4-115_P1.png',
        category_id: '503004',
        count: 4,
      },
    ],
    adjustment_cards: [
      {
        img_file_name: 'EX2-074_P1.png',
        category_id: '503002',
        count: 2,
      },
    ],
    user_id: '07f26858-ca75-457e-85a8-803ce90cd43d',
    comment: 'Lv.3の枚数調整',
  },
  {
    id: v4(),
    created_at: new Date('2023-01-23T10:22:00+0900').toISOString(),
    deck_id: 'bc25f4b3-15a7-4760-bd9e-4ca45d4bef1d',
    cards: [
      {
        img_file_name: 'BT2-068.png',
        category_id: '503002',
        count: 3,
      },
      {
        img_file_name: 'EX2-039.png',
        category_id: '503010',
        count: 3,
      },
      {
        img_file_name: 'ST14-03.png',
        category_id: '503114',
        count: 4,
      },
      {
        img_file_name: 'EX2-071.png',
        category_id: '503010',
        count: 4,
      },
      {
        img_file_name: 'BT7-109.png',
        category_id: '503008',
        count: 3,
      },
      {
        img_file_name: 'BT2-090.png',
        category_id: '503002',
        count: 3,
      },
      {
        img_file_name: 'EX2-074_P1.png',
        category_id: '503010',
        count: 2,
      },
      {
        img_file_name: 'BT2-111.png',
        category_id: '503002',
        count: 4,
      },
      {
        img_file_name: 'BT7-111_P1.png',
        category_id: '503008',
        count: 4,
      },
      {
        img_file_name: 'BT4-115_P1.png',
        category_id: '503004',
        count: 4,
      },
    ],
    adjustment_cards: [
      {
        img_file_name: 'EX2-074_P1.png',
        category_id: '503002',
        count: 2,
      },
    ],
    user_id: '07f26858-ca75-457e-85a8-803ce90cd43d',
    comment: 'デススリンガー追加',
  },
];

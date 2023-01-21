import {
  Card,
  CardOriginal,
  convertCardFromOriginal,
} from '@beelzebub/shared/domain';
import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError } from 'zod';
import { supabaseForServer } from '../../../lib/supabase-client';

const upsertCard = async (card: Card) => {
  const data = await supabaseForServer.from('Cards').upsert({ ...card });
  console.info('insert result: ', data);
  return data;
};

export const postCards = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // TODO: 認証処理を追加。特定のユーザしか登録できないようにする
    const body = JSON.parse(req.body);
    const { category } = req.query;
    if (body.cardInfoList == null) {
      return res.status(400).json({ message: 'cardInfoList is required' });
    }
    if (typeof category !== 'string') {
      return res.status(400).json({
        message: 'category is invalid',
      });
    }
    const parsedCardOriginals = z.array(CardOriginal).parse(body.cardInfoList);
    const parsedCards = parsedCardOriginals.map((v) => {
      return convertCardFromOriginal(v, category);
    });
    const responses = await Promise.all(
      parsedCards.map((card) => {
        return upsertCard(card);
      })
    );
    return res.status(200).json({ responses });
  } catch (error) {
    console.error((error as ZodError).errors);
    return res.status(500).json({
      message: JSON.stringify(error),
    });
  }
};

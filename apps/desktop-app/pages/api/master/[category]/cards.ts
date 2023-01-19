import {
  CardOriginal,
  Category,
  convertCardFromOriginal,
} from '@beelzebub/shared/domain';
import { NextApiHandler } from 'next';
import { z, ZodError } from 'zod';

export const handler: NextApiHandler = async (req, res) => {
  try {
    // TODO: 認証処理を追加
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    const body = req.body;
    if (body.cardInfoList == null) {
      return res.status(400).json({ message: 'cardInfoList is required' });
    }
    const { category } = req.query;
    const parsedCategory = Category.parse(category);
    const parsedCardOriginals = z.array(CardOriginal).parse(body.cardInfoList);
    const parsedCards = parsedCardOriginals.map((v) => {
      return convertCardFromOriginal(v, parsedCategory);
    });
    // TODO: supabaseへの登録処理を追加
    return res.status(200).json({ cards: parsedCards });
  } catch (error) {
    console.error((error as ZodError).errors);
    return res.status(500).json({
      message: JSON.stringify(error),
    });
  }
};

export default handler;

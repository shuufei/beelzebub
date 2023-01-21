import { Card } from '@beelzebub/shared/domain';
import { NextApiHandler } from 'next';
import { getCards } from '../../features/cards/api/get';

export type GetCardsResponseBody = {
  cards: Card[];
};

export const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getCards(req, res);
    default:
      return res.status(405).end();
  }
};

export default handler;

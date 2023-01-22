import { getCards } from '@beelzebub/card/api';
import { handleResponseError } from '@beelzebub/shared/api';
import { Card } from '@beelzebub/shared/domain';
import { NextApiHandler } from 'next';

export type GetCardsResponseBody = {
  cards: Card[];
};

export const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        const { cards } = await getCards(req, res);
        const body: GetCardsResponseBody = { cards };
        return res.status(200).json(body);
      } catch (error) {
        return handleResponseError(res, error);
      }
    default:
      return res.status(405).end();
  }
};

export default handler;

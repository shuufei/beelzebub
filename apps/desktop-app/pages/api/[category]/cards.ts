import { NextApiHandler } from 'next';
import { postCards } from '../../../features/cards/api/post';

export const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return postCards(req, res);
    case 'GET':
    default:
      return res.status(405).end();
  }
};

export default handler;

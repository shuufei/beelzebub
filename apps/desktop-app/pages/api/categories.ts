import { getCategories } from '@beelzebub/card/api';
import { handleResponseError } from '@beelzebub/shared/api';
import { NextApiHandler } from 'next';

export const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        const body = await getCategories(req, res);
        return res.status(200).json(body);
      } catch (error) {
        return handleResponseError(res, error);
      }
    default:
      return res.status(405).end();
  }
};

export default handler;

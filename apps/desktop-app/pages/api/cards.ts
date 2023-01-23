import { postCards } from '@beelzebub/card/api';
import { handleResponseError } from '@beelzebub/shared/api';
import { NextApiHandler } from 'next';

export const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      try {
        await postCards(req, res);
        return res.status(200).json({});
      } catch (error) {
        return handleResponseError(res, error);
      }
    default:
      return res.status(405).end();
  }
};

export default handler;

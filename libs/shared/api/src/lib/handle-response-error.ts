import { HttpError } from '@beelzebub/shared/errors';
import { NextApiResponse } from 'next';

export const handleResponseError = (res: NextApiResponse, error: unknown) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json(error);
  }
  return res.status(500).end();
};

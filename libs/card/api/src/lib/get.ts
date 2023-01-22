import {
  InternalServerError,
  isPermitted,
  Unauthorized,
} from '@beelzebub/shared/api';
import { Card } from '@beelzebub/shared/domain';
import { supabaseServerClient } from '@beelzebub/shared/libs';
import { NextApiRequest, NextApiResponse } from 'next';

export const getCards = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ cards: Card[] }> => {
  if (!(await isPermitted(req, res))) {
    throw new Unauthorized();
  }
  // TODO: paging
  const { data, error } = await supabaseServerClient
    .from('Cards')
    .select()
    .limit(10);
  if (data != null) {
    // TODO: schema validate
    return { cards: data };
  } else {
    console.error('failed get cards from supabase: ', error);
    throw new InternalServerError();
  }
};

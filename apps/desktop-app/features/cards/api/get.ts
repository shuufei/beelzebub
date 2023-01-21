import { Card } from '@beelzebub/shared/domain';
import { NextApiRequest, NextApiResponse } from 'next';
import { InternalServerError } from '../../../errors/internal-server-error';
import { Unauthorized } from '../../../errors/unauthorized';
import { supabaseForServer } from '../../../lib/supabase-client';
import { isPermitted } from '../../auth/api/is-permitted';

export const getCards = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ cards: Card[] }> => {
  if (!(await isPermitted(req, res))) {
    throw new Unauthorized();
  }
  // TODO: paging
  const { data, error } = await supabaseForServer
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

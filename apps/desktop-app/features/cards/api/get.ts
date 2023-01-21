import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseForServer } from '../../../lib/supabase-client';
import { isPermitted } from '../../auth/api/is-permitted';

export const getCards = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await isPermitted(req, res))) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  // TODO: paging
  const { data, error } = await supabaseForServer
    .from('Cards')
    .select()
    .limit(10);
  if (data != null) {
    // TODO: schema validate
    return res.status(200).json({ cards: data });
  } else {
    return res.status(500).json({ error });
  }
};

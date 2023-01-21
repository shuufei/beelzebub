import {
  Card,
  CardOriginal,
  convertCardFromOriginal,
} from '@beelzebub/shared/domain';
import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError } from 'zod';
import { BadRequest } from '../../../errors/bad-request';
import { InternalServerError } from '../../../errors/internal-server-error';
import { Unauthorized } from '../../../errors/unauthorized';
import { supabaseForServer } from '../../../lib/supabase-client';
import { isPermitted } from '../../auth/api/is-permitted';

const upsertCard = async (card: Card) => {
  const data = await supabaseForServer.from('Cards').upsert({ ...card });
  console.info('insert result: ', data);
  return data;
};

export const postCards = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    if (!(await isPermitted(req, res, true))) {
      throw new Unauthorized();
    }
    const body = JSON.parse(req.body);
    const { category } = req.query;
    if (body.cardInfoList == null) {
      throw new BadRequest('cardInfoList is required');
    }
    if (typeof category !== 'string') {
      throw new BadRequest('category is invalid');
    }
    const parsedCardOriginals = z.array(CardOriginal).parse(body.cardInfoList);
    const parsedCards = parsedCardOriginals.map((v) => {
      return convertCardFromOriginal(v, category);
    });
    const results = await Promise.all(
      parsedCards.map((card) => {
        return upsertCard(card);
      })
    );
    console.info('supabase upsert results: ', results);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequest(JSON.stringify(error.errors));
    }
    console.error('failed upsert cards: ', error);
    throw new InternalServerError();
  }
};
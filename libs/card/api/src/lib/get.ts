import { isPermitted } from '@beelzebub/shared/api';
import { Card } from '@beelzebub/shared/domain';
import {
  BadRequest,
  HttpError,
  InternalServerError,
  Unauthorized,
} from '@beelzebub/shared/errors';
import { supabaseServerClient } from '@beelzebub/shared/libs';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const GetCardsRequestQuery = z.object({
  page: z.union([z.undefined(), z.string()]),
  // limit: z.union([z.undefined(), z.number()]),
  category: z.union([z.undefined(), z.string()]),
  lv: z.union([z.undefined(), z.string()]),
  cardtype: z.union([z.undefined(), z.string()]),
  colors: z.union([z.undefined(), z.string()]),
  includeParallel: z.union([
    z.undefined(),
    z.literal('true'),
    z.literal('false'),
  ]),
});
export type GetCardsRequestQuery = z.infer<typeof GetCardsRequestQuery>;

const GetCardsResponseBody = z.object({
  cards: z.array(Card),
});
export type GetCardsResponseBody = z.infer<typeof GetCardsResponseBody>;

const MAX_FETCH_COUNT = 50;

export const getCards = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<GetCardsResponseBody> => {
  try {
    if (!(await isPermitted(req, res))) {
      throw new Unauthorized();
    }
    const parsed = GetCardsRequestQuery.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequest(`query is invalid`);
    }
    const reqQuery = parsed.data;
    const page = Number(reqQuery.page ?? 1);
    if (Number.isNaN(page)) {
      throw new BadRequest(`page is invalid`);
    }

    const offset = MAX_FETCH_COUNT * ((page <= 0 ? 1 : page) - 1);
    const limit = MAX_FETCH_COUNT * page;

    const dbQuery = supabaseServerClient
      .from('Cards')
      .select()
      .range(offset, limit)
      .order('cardtype', { ascending: false })
      .order('lv', { ascending: true })
      .order('colors', { ascending: true })
      .order('no', { ascending: true })
      .in('parallel', ['false', reqQuery.includeParallel ?? true]);

    if (reqQuery.category) {
      dbQuery.in('category', reqQuery.category.split(','));
    }
    if (reqQuery.lv) {
      dbQuery.in('lv', reqQuery.lv.split(','));
    }
    if (reqQuery.cardtype) {
      dbQuery.in('cardtype', reqQuery.cardtype.split(','));
    }
    if (reqQuery.colors) {
      dbQuery.containedBy('colors', reqQuery.colors.split(','));
    }
    const { data, error } = await dbQuery;

    if (data != null) {
      const parsed = GetCardsResponseBody.parse({ cards: data });
      return parsed;
    } else {
      throw new InternalServerError(
        `failed get cards from supabase: ${JSON.stringify(error)}`
      );
    }
  } catch (error) {
    console.error(JSON.stringify(error));
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(`${error}`);
  }
};

import { isPermitted } from '@beelzebub/shared/api';
import {
  Card,
  CardOriginal,
  convertCardFromOriginal,
} from '@beelzebub/shared/domain';
import {
  BadRequest,
  InternalServerError,
  Unauthorized,
} from '@beelzebub/shared/errors';
import { supabaseServerClient } from '@beelzebub/shared/libs';
import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError } from 'zod';

export const PostCardsRequestBody = z.object({
  data: z.any(),
  categoryId: z.string(),
  categoryName: z.string(),
});
export type PostCardsRequestBody = z.infer<typeof PostCardsRequestBody>;

const upsertCard = async (card: Card) => {
  const data = await supabaseServerClient.from('Cards').upsert({ ...card });
  console.info('upsert result: ', data);
  return data;
};

const upsertCategory = async (id: string, categoryName: string) => {
  const data = await supabaseServerClient.from('Categories').upsert({
    id,
    categoryName,
  });
  console.info('upsert result: ', data);
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
    const body = PostCardsRequestBody.parse(JSON.parse(req.body));
    const data = JSON.parse(body.data);
    if (!('cardInfoList' in data)) {
      throw new BadRequest('cardInfoList is required');
    }
    const parsedCardOriginals = z.array(CardOriginal).parse(data.cardInfoList);
    const parsedCards = parsedCardOriginals.map((v) => {
      return convertCardFromOriginal(v, body.categoryId);
    });
    await upsertCategory(body.categoryId, body.categoryName);
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

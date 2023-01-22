import { isPermitted } from '@beelzebub/shared/api';
import { Card } from '@beelzebub/shared/domain';
import { InternalServerError, Unauthorized } from '@beelzebub/shared/errors';
import { supabaseServerClient } from '@beelzebub/shared/libs';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const GetCardsResponseBody = z.object({
  cards: z.array(Card),
});
export type GetCardsResponseBody = z.infer<typeof GetCardsResponseBody>;

export const getCards = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<GetCardsResponseBody> => {
  try {
    if (!(await isPermitted(req, res))) {
      throw new Unauthorized();
    }
    // TODO: paging
    const { data, error } = await supabaseServerClient
      .from('Cards')
      .select()
      .limit(10);

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
    throw new InternalServerError();
  }
};

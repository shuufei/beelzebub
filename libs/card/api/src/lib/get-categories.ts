import { isPermitted } from '@beelzebub/shared/api';
import { Category } from '@beelzebub/shared/domain';
import { InternalServerError, Unauthorized } from '@beelzebub/shared/errors';
import { supabaseServerClient } from '@beelzebub/shared/libs';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export type GetCategoriesResponseBody = {
  categories: Category[];
};

export const getCategories = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<GetCategoriesResponseBody> => {
  if (!(await isPermitted(req, res))) {
    throw new Unauthorized();
  }
  const result = await supabaseServerClient
    .from('Categories')
    .select()
    .order('categoryName', { ascending: true });
  if (result.error != null) {
    throw new InternalServerError(
      `failed select categories: ${JSON.stringify(result.error)}`
    );
  }
  const categories = z.array(Category).parse(result.data);
  return { categories };
};

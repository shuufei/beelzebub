import { CardDB, CategoryDB, convertToCardDB } from '@beelzebub/shared/db';
import {
  CardOriginal,
  Category,
  convertCardFromOriginal,
} from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { z, ZodError } from 'zod';

export const useInsertCards = () => {
  const supabaseClient = useSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insert = useCallback(async (category: Category, data: any) => {
    try {
      if (!('cardInfoList' in data)) {
        throw new Error('cardInfoList is required');
      }
      const parsedCardOriginals = z
        .array(CardOriginal)
        .parse(data.cardInfoList);
      const parsedCards = parsedCardOriginals.map((v) => {
        return convertCardFromOriginal(v, category.id);
      });
      const categoryDb: CategoryDB = {
        id: category.id,
        category_name: category.categoryName,
        created_at: new Date().toISOString(),
      };
      const categoryUpsertResult = await supabaseClient
        .from('categories')
        .upsert({ ...categoryDb });
      if (categoryUpsertResult.error != null) {
        throw new Error(
          `failed upsert category: ${JSON.stringify(categoryUpsertResult)}`
        );
      }
      console.info('category upsert result: ', categoryUpsertResult);

      const results = await Promise.all(
        parsedCards.map((card) => {
          const cardDb: CardDB = convertToCardDB(card);
          return supabaseClient.from('cards').upsert({ ...cardDb });
        })
      );
      console.info('supabase upsert results: ', results);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('original card data is invalid: ', error);
      }
      throw error;
    }
  }, []);

  return insert;
};

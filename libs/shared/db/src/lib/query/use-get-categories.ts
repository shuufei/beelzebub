import { Category } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useSWR from 'swr';
import { z } from 'zod';
import { CategoryDB, convertToCategory } from '../categories';

export const useGetCategories = () => {
  const supabaseClient = useSupabaseClient();
  return useSWR<Category[]>('/supabase/db/categories', async () => {
    const result = await supabaseClient
      .from('categories')
      .select()
      .order('category_name', { ascending: true });
    if (result.error != null) {
      throw new Error(
        `failed select categories: ${JSON.stringify(result.error)}`
      );
    }
    const parsed = z.array(CategoryDB).parse(result.data);
    const categories: Category[] = parsed.map(convertToCategory);
    return categories;
  });
};

import { Category } from '@beelzebub/shared/domain';
import { z } from 'zod';

export const CategoryDB = z.object({
  id: z.string(),
  created_at: z.string(),
  category_name: z.string(),
});

export type CategoryDB = z.infer<typeof CategoryDB>;

export const convertToCategory = (data: CategoryDB): Category => {
  return {
    id: data.id,
    categoryName: data.category_name,
  };
};

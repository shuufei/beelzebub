import { z } from 'zod';

export const Category = z.object({
  id: z.string(),
  categoryName: z.string(),
});

export type Category = z.infer<typeof Category>;

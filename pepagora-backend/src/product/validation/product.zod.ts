import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  subcategory: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid subcategory ID'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

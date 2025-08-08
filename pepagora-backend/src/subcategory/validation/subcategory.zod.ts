import { z } from 'zod';

export const createSubcategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Subcategory name must be at least 2 characters long' })
    .max(50, { message: 'Subcategory name must be less than 50 characters' }),

  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId' }),

  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),

  imageUrl: z
    .string()
    .url({ message: 'Image URL must be a valid URL' })
    .optional(),
});

// TypeScript type inferred from Zod
export type CreateSubcategoryDto = z.infer<typeof createSubcategorySchema>;

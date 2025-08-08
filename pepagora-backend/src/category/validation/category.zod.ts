import { z } from 'zod';

// Define the Zod schema for Category
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters long' })
    .max(50, { message: 'Category name must be less than 50 characters' }),

  metaTitle: z
    .string()
    .optional(),

  metaKeyword: z
    .string()
    .optional(),

  metaDescription: z
    .string()
    .optional(),


  imageUrl: z
    .string()
    .url({ message: 'Image URL must be a valid URL' })
    .optional(),

});

// Infer TypeScript type from Zod schema
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

import { z } from 'zod';

export const DummyProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),         // NOTE: number (not object)
  stock: z.number().int(),
  brand: z.string(),
  category: z.string(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
});
export type DummyProduct = z.infer<typeof DummyProductSchema>;

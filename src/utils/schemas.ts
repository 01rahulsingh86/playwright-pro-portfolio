import { z } from 'zod';

export const CatFactSchema = z.object({
  fact: z.string().min(1),
  length: z.number().int().positive(),
});

export type CatFact = z.infer<typeof CatFactSchema>;

// FakeStore product schema (public demo API)
export const ProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string().url(),
  rating: z.object({
    rate: z.number(),
    count: z.number().int(),
  }),
});
export type Product = z.infer<typeof ProductSchema>;

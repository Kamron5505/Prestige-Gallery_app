import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    description: z.string().min(10),
    price: z.number().positive(),
    discountPrice: z.number().positive().optional(),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().min(0).default(0),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isGift: z.boolean().optional(),
    composition: z.string().optional(),
    size: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    discountPrice: z.number().positive().optional(),
    category: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isGift: z.boolean().optional(),
    isActive: z.boolean().optional(),
    composition: z.string().optional(),
    size: z.string().optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    premium: z.coerce.boolean().optional(),
    new: z.coerce.boolean().optional(),
    gift: z.coerce.boolean().optional(),
    search: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
  }),
});

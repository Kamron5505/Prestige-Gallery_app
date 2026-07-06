import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: z.string().min(1),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, 'At least one item is required'),
    customerInfo: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(5),
    }),
    deliveryAddress: z.object({
      street: z.string().min(5),
      city: z.string().min(2),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    }),
    deliveryDate: z.string().min(1, 'Delivery date is required'),
    deliveryTime: z.string().optional(),
    paymentMethod: z.enum(['cash', 'card', 'transfer']).optional(),
    promoCode: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'delivered', 'cancelled']),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  }),
});

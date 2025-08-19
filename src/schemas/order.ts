import { z } from "zod";

const OrderProductSchema = z.object({
  product: z.string(), // objectId as string
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const PopulatedOwnerSchema = z.object({
  _id: z.string(),
  username: z.string().optional(),
  email: z.string().optional(),
  admin: z.boolean().optional(),
});

export const OrderSchema = z.object({
  _id: z.string(),
  owner: PopulatedOwnerSchema,
  products: z.array(OrderProductSchema),
  price: z.number(),
  delivered: z.boolean(),
  address: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

// schema to make a new order
export const CreateOrderSchema = z.object({
  products: z.array(OrderProductSchema),
  address: z.string(),
  price: z.number().positive(),
});

export type CreateOrderData = z.infer<typeof CreateOrderSchema>;

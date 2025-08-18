import { z } from "zod";
import { UserSchema } from "./user";

const OrderProductSchema = z.object({
  product: z.string(), // objectId as string
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const OrderSchema = z.object({
  _id: z.string(),
  owner: UserSchema,
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

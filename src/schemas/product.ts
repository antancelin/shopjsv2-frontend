import { z } from "zod";

const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

const ReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string().datetime(),
  reviewerName: z.string(),
  reviewerEmail: z.string().email(),
});

// schema for product
export const ProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),
  dimensions: DimensionsSchema,
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(ReviewSchema),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  images: z.array(z.string().url()),
  thumbnail: z.string().url(),
});

// type typescript auto generated
export type Product = z.infer<typeof ProductSchema>;

// schema for array of products
export const ProductsSchema = z.array(ProductSchema);
export type Products = z.infer<typeof ProductsSchema>;

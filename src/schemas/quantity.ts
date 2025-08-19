import { z } from "zod";

export const QuantitySchema = z.object({
  quantity: z
    .number()
    .min(0, "La quantité ne peut pas être négative")
    .max(99, "Quantité maximale : 99 articles")
    .int("La quantité doit être un nombre entier"),
});

export type QuantityData = z.infer<typeof QuantitySchema>;

import { z } from "zod";

export const SearchSchema = z.object({
  query: z
    .string()
    .min(2, "La recherche doit contenir au moins 2 caractères")
    .max(50, "La recherche ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Caractères spéciaux non autorisés"),
});

export type SearchData = z.infer<typeof SearchSchema>;

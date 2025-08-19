import { z } from "zod";

export const PaymentSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address1: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  address2: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  phone: z
    .string()
    .regex(/^[0-9\s\-\+\.]{10,}$/, "Le numéro de téléphone n'est pas valide"),
});

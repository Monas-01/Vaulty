import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  warrantyMonths: z
    .number({ message: "Warranty months must be a number" })
    .int("Warranty months must be an integer")
    .min(0, "Warranty months cannot be negative"),
  store: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  purchasePrice: z
    .number({ message: "Price must be a number" })
    .min(0, "Price cannot be negative")
    .optional()
    .nullable(),
  receiptUrl: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

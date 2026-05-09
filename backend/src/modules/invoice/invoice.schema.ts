import { numericStringSchema } from "@lib/validations";
import { z } from "zod";

export const invoiceIdParamSchema = z.object({
  id: numericStringSchema,
});

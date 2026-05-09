import { numericStringSchema } from "@lib/validations";
import { z } from "zod";

export const paymentIdParamSchema = z.object({
  id: numericStringSchema,
});

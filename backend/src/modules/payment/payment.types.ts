import { z } from "zod";
import { paymentIdParamSchema } from "./payment.schema.ts";
import { Prisma } from "@generated/prisma/client.ts";
import { PaymentMethod } from "@generated/prisma/enums.ts";

export type PaymentIdParam = z.infer<typeof paymentIdParamSchema>;

export type CreatePaymentTxParams = {
  tx: Prisma.TransactionClient;
  invoice_id: number;
  amount: number;
  method: PaymentMethod;
};

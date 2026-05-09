import { z } from "zod";
import { invoiceIdParamSchema } from "./invoice.schema.ts";
import { Prisma } from "@generated/prisma/client.ts";

export type InvoiceIdParam = z.infer<typeof invoiceIdParamSchema>;

export type CreateInvoiceTxParams = {
  tx: Prisma.TransactionClient;
  reservation_id: number;
  check_in_date: Date;
  nights: number;
  base_price: number;
  roomCost: number;
  mealPlan: { name: string; price_per_night: number } | null;
  mealPlanCost: number;
  children: number;
  childrenDiscount: number;
};
import { prisma } from "@lib/prisma.ts";
import { CreatePaymentTxParams } from "./payment.types.ts";
import { PaymentStatus } from "@generated/prisma/enums.ts";

const ERRORS = {
  NOT_FOUND: { status: 404, message: "Payment not found" },
};

export const PaymentService = {
  createPaymentInTx: async ({
    tx,
    invoice_id,
    amount,
    method,
  }: CreatePaymentTxParams) => {
    return tx.payment.create({
      data: {
        invoice_id,
        amount,
        method,
        status: PaymentStatus.COMPLETED,
        paid_at: new Date(),
      },
    });
  },

  getPaymentById: async (id: number) => {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw ERRORS.NOT_FOUND;
    return payment;
  },
};

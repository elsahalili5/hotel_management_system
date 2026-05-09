import { prisma } from "@lib/prisma.ts";
import { CreateInvoiceTxParams } from "./invoice.types.ts";
import { InvoiceStatus } from "@generated/prisma/enums.ts";

const ERRORS = {
  NOT_FOUND: { status: 404, message: "Invoice not found" },
};

export const InvoiceService = {
  createInvoiceInTx: async ({
    tx,
    reservation_id,
    check_in_date,
    nights,
    base_price,
    roomCost,
    mealPlan,
    mealPlanCost,
    children,
    childrenDiscount,
  }: CreateInvoiceTxParams) => {
    const invoice = await tx.invoice.create({
      data: {
        reservation_id,
        status: InvoiceStatus.ISSUED,
        issued_at: new Date(),
        due_date: check_in_date,
      },
    });

    await tx.invoiceItem.create({
      data: {
        invoice_id: invoice.id,
        description: `Room — ${nights} night(s)`,
        quantity: nights,
        unit_price: base_price,
        total: roomCost,
      },
    });

    if (mealPlan && mealPlanCost > 0) {
      await tx.invoiceItem.create({
        data: {
          invoice_id: invoice.id,
          description: `Meal plan: ${mealPlan.name} — ${nights} night(s)`,
          quantity: nights,
          unit_price: mealPlan.price_per_night,
          total: mealPlanCost,
        },
      });
    }

    if (children > 0 && childrenDiscount > 0) {
      await tx.invoiceItem.create({
        data: {
          invoice_id: invoice.id,
          description: `Children discount (${children} child${children > 1 ? "ren" : ""})`,
          quantity: 1,
          unit_price: -childrenDiscount,
          total: -childrenDiscount,
        },
      });
    }

    return invoice;
  },

  getInvoiceById: async (id: number) => {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
    if (!invoice) throw ERRORS.NOT_FOUND;
    return invoice;
  },
};

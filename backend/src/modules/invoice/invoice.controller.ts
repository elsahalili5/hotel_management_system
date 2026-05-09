import { Response } from "express";
import { TypedRequest } from "@lib/types.ts";
import { InvoiceService } from "./invoice.service.ts";
import { InvoiceIdParam } from "./invoice.types.ts";

export const InvoiceController = {
  getInvoiceById: async (
    req: TypedRequest<unknown, InvoiceIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const invoice = await InvoiceService.getInvoiceById(id);
      return res.status(200).json({ data: invoice });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch invoice" });
    }
  },
};

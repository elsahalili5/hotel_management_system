import { Response } from "express";
import { TypedRequest } from "@lib/types.ts";
import { PaymentService } from "./payment.service.ts";
import { PaymentIdParam } from "./payment.types.ts";

export const PaymentController = {
  getPaymentById: async (
    req: TypedRequest<unknown, PaymentIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const payment = await PaymentService.getPaymentById(id);
      return res.status(200).json({ data: payment });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch payment" });
    }
  },
};

import { Router } from "express";
import { PaymentController } from "./payment.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { paymentIdParamSchema } from "./payment.schema.ts";

const router = Router();

router.get(
  "/:id",
  authMiddleware,
  validateRequestMiddleware(paymentIdParamSchema, "params"),
  PaymentController.getPaymentById,
);

export default router;

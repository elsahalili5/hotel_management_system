import { Router } from "express";
import { InvoiceController } from "./invoice.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { invoiceIdParamSchema } from "./invoice.schema.ts";

const router = Router();

router.get(
  "/:id",
  authMiddleware,
  validateRequestMiddleware(invoiceIdParamSchema, "params"),
  InvoiceController.getInvoiceById,
);

export default router;

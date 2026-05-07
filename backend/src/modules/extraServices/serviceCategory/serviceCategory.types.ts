import { z } from "zod";
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
  serviceCategoryIdSchema,
} from "./serviceCategory.schema.ts";

export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
export type ServiceCategoryIdParam = z.infer<typeof serviceCategoryIdSchema>;

export type ServiceCategoryResponse = {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  _count: { services: number };
};
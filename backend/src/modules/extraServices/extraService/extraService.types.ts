import { z } from "zod";
import {
  extraServiceIdParamSchema,
  createExtraServiceSchema,
  updateExtraServiceSchema,
} from "./extraService.schema.ts";

export type ExtraServiceIdParam = z.infer<typeof extraServiceIdParamSchema>;
export type CreateExtraServiceInput = z.infer<typeof createExtraServiceSchema>;
export type UpdateExtraServiceInput = z.infer<typeof updateExtraServiceSchema>;

export type ExtraServiceResponse = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  is_active: boolean;
  is_available_24h: boolean;
  available_from: string | null;
  available_until: string | null;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
};

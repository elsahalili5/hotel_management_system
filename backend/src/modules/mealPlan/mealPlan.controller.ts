import { Response } from "express";
import { TypedRequest } from "@lib/types.ts";
import { MealPlanService } from "./mealPlan.service.ts";
import {
  CreateMealPlanInput,
  UpdateMealPlanInput,
  MealPlanIdParam,
} from "./mealPlan.types.ts";

export const MealPlanController = {
  getMealPlans: async (_req: TypedRequest, res: Response) => {
    try {
      const mealPlans = await MealPlanService.getAllMealPlans();
      return res.status(200).json(mealPlans);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch meal plans" });
    }
  },

  getMealPlanById: async (
    req: TypedRequest<unknown, MealPlanIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const mealPlan = await MealPlanService.getMealPlanById(id);
      return res.status(200).json(mealPlan);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch meal plan" });
    }
  },

  createMealPlan: async (
    req: TypedRequest<CreateMealPlanInput>,
    res: Response,
  ) => {
    try {
      const mealPlan = await MealPlanService.createMealPlan(req.body);
      return res.status(201).json(mealPlan);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to create meal plan" });
    }
  },

  updateMealPlan: async (
    req: TypedRequest<UpdateMealPlanInput, MealPlanIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const mealPlan = await MealPlanService.updateMealPlan(id, req.body);
      return res.status(200).json(mealPlan);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to update meal plan" });
    }
  },

  deleteMealPlan: async (
    req: TypedRequest<unknown, MealPlanIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      await MealPlanService.deleteMealPlan(id);
      return res.status(200).json({ message: "Meal plan deleted successfully" });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to delete meal plan" });
    }
  },
};

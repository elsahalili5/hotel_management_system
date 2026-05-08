import { prisma } from "@lib/prisma.ts";
import { CreateMealPlanInput, UpdateMealPlanInput } from "./mealPlan.types.ts";

const throwError = (status: number, message: string): never => {
  throw { status, message };
};

export const MealPlanService = {
  getAllMealPlans: async () => {
    return prisma.mealPlan.findMany({
      orderBy: { name: "asc" },
    });
  },

  getMealPlanById: async (id: number) => {
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id } });

    if (!mealPlan) {
      throwError(404, "Meal plan not found");
    }

    return mealPlan;
  },

  createMealPlan: async (data: CreateMealPlanInput) => {
    const existing = await prisma.mealPlan.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throwError(409, "A meal plan with this name already exists");
    }

    return prisma.mealPlan.create({ data });
  },

  updateMealPlan: async (id: number, data: UpdateMealPlanInput) => {
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id } });

    if (!mealPlan) {
      throwError(404, "Meal plan not found");
    }

    if (data.name && data.name !== mealPlan!.name) {
      const existing = await prisma.mealPlan.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throwError(409, "A meal plan with this name already exists");
      }
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    return prisma.mealPlan.update({ where: { id }, data: cleanData });
  },

  deleteMealPlan: async (id: number) => {
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id } });

    if (!mealPlan) {
      throwError(404, "Meal plan not found");
    }

    await prisma.mealPlan.delete({ where: { id } });
  },
};

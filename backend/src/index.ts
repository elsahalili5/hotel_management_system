import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";

import authRoutes from "@modules/auth/auth.routes.ts";

import userRoutes from "./modules/users/user.routes.ts";
import guestRoutes from "./modules/guest/guest.routes.ts";
import staffRoutes from "./modules/staff/staff.routes.ts";
import amenityRoutes from "@modules/rooms/amenity/amenity.routes.ts";
import roomTypeRoutes from "@modules/rooms/roomType/roomType.routes.ts";
import roomRoutes from "@modules/rooms/room/room.routes.ts";
import bedRoutes from "@modules/rooms/bed/bed.routes.ts";
import cleaningTaskRoutes from "@modules/cleaningTask/cleaningTask.routes.ts";
import serviceCategoryRoutes from "@modules/extraServices/serviceCategory/serviceCategory.routes.ts";
import extraServiceRoutes from "@modules/extraServices/extraService/extraService.routes.ts";
import mealPlanRoutes from "@modules/mealPlan/mealPlan.routes.ts";
import reservationRoutes from "@modules/reservation/reservation.routes.ts";
import invoiceRoutes from "@modules/invoice/invoice.routes.ts";
import paymentRoutes from "@modules/payment/payment.routes.ts";
import reviewRoutes from "@modules/review/review.routes.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/cleaning-tasks", cleaningTaskRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/extra-services", extraServiceRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
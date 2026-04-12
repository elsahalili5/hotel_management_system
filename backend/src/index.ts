import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";

import authRoutes from "@modules/auth/auth.routes.ts";

import userRoutes from "./modules/users/user.routes.ts";
import guestRoutes from "./modules/guest/guest.routes.ts";
import staffRoutes from "./modules/staff/staff.routes.ts";

import amenityRoutes from "./routes/rooms/amenityRoutes";
import roomTypeRoutes from "./routes/rooms/roomTypeRoutes";
import roomRoutes from "./routes/rooms/roomRoutes.ts";
import bedRoutes from "./routes/rooms/bedRoutes.ts";

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

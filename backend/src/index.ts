import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";
import authRoutes from "./routes/auth/authRoutes.ts";
import amenityRoutes from "./routes/rooms/amenityRoutes";
import roomTypeRoutes from "./routes/rooms/roomTypeRoutes";
import bedRoutes from "./routes/rooms/bedRoutes.ts";
import guestRouter from "./routes/guestRoutes.ts";
import staffRouter from "./routes/staffRoutes.ts";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/guests", guestRouter);
app.use("/api/staff", staffRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

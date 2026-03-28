import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";
import { Request, Response } from "express";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

export const getUsers = (req: Request, res: Response) => {
  res.json([{ id: 1, name: "Elsa" }]);
};

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/api/ping", (req, res) => {
  res.json([{ id: 1, name: "Elsa" }]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

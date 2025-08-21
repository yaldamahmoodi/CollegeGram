import { Router } from "express";
import userRoutes from "./auth.routes";

export const router = Router();

router.use("/users", userRoutes);


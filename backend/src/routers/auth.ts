import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { login, logout, me, refresh, register } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.get("/me", authMiddleware, me);
authRouter.post("/logout", logout);

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { listBadges } from "../controllers/badgesController.js";

export const badgesRouter = Router();
badgesRouter.use(authMiddleware);
badgesRouter.get("/", listBadges);

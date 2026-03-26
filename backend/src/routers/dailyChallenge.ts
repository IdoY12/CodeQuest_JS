import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getDailyChallenge, submitDailyChallenge } from "../controllers/dailyChallengeController.js";

export const dailyChallengeRouter = Router();

dailyChallengeRouter.get("/", getDailyChallenge);
dailyChallengeRouter.use(authMiddleware);
dailyChallengeRouter.post("/submit", submitDailyChallenge);

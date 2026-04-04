import { Router } from "express";
import { dailyChallengeGetHandler } from "../controllers/dailyChallenge/dailyChallengeGetHandler.js";
import { dailyChallengeSubmitHandler } from "../controllers/dailyChallenge/dailyChallengeSubmitHandler.js";
import { authMiddleware } from "../middlewares/auth.js";

export const dailyChallengeRouter = Router();

dailyChallengeRouter.get("/", dailyChallengeGetHandler);
dailyChallengeRouter.use(authMiddleware);
dailyChallengeRouter.post("/submit", dailyChallengeSubmitHandler);

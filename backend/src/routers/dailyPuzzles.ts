import { Router } from "express";
import { getDailyPuzzleToday, validateDailyPuzzleAnswer } from "../controllers/dailyPuzzleContentController.js";

export const dailyPuzzlesRouter = Router();

dailyPuzzlesRouter.get("/today", getDailyPuzzleToday);
dailyPuzzlesRouter.post("/validate", validateDailyPuzzleAnswer);

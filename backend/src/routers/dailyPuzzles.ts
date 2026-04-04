import { Router } from "express";
import { dailyPuzzleTodayHandler } from "../controllers/dailyPuzzle/dailyPuzzleTodayHandler.js";
import { dailyPuzzleValidateHandler } from "../controllers/dailyPuzzle/dailyPuzzleValidateHandler.js";

export const dailyPuzzlesRouter = Router();

dailyPuzzlesRouter.get("/today", dailyPuzzleTodayHandler);
dailyPuzzlesRouter.post("/validate", dailyPuzzleValidateHandler);

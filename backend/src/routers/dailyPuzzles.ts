import { Router } from "express";
import { dailyPuzzleTodayHandler } from "../controllers/dailyPuzzle/dailyPuzzleTodayHandler.js";
import { dailyPuzzleByIdHandler } from "../controllers/dailyPuzzle/dailyPuzzleByIdHandler.js";
import { dailyPuzzleSubmitHandler } from "../controllers/dailyPuzzle/dailyPuzzleSubmitHandler.js";

export const dailyPuzzlesRouter = Router();

dailyPuzzlesRouter.get("/today", dailyPuzzleTodayHandler);
dailyPuzzlesRouter.get("/:id", dailyPuzzleByIdHandler);
dailyPuzzlesRouter.post("/:id/submit", dailyPuzzleSubmitHandler);

import { Router } from "express";
import { codePuzzleAllHandler } from "../controllers/codePuzzle/codePuzzleAllHandler.js";
import { codePuzzleSubmitHandler } from "../controllers/codePuzzle/codePuzzleSubmitHandler.js";
import { optionalAuthMiddleware } from "../middlewares/auth.js";

export const codePuzzlesRouter = Router();

codePuzzlesRouter.get("/all", codePuzzleAllHandler);
codePuzzlesRouter.post("/:id/submit", optionalAuthMiddleware, codePuzzleSubmitHandler);

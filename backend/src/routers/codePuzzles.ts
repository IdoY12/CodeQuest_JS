import { Router } from "express";
import { codePuzzleAllHandler } from "../controllers/codePuzzle/codePuzzleAllHandler.js";
import { codePuzzleSubmitHandler } from "../controllers/codePuzzle/codePuzzleSubmitHandler.js";
import { optionalAuthMiddleware } from "../middlewares/auth.js";
import { validateBody, validateParams } from "../middlewares/validateBody.js";
import { codePuzzleSubmitBodySchema, codePuzzleSubmitParamsSchema } from "../validators/codePuzzleValidators.js";

export const codePuzzlesRouter = Router();

codePuzzlesRouter.get("/all", codePuzzleAllHandler);
codePuzzlesRouter.post(
  "/:id/submit",
  optionalAuthMiddleware,
  validateParams(codePuzzleSubmitParamsSchema),
  validateBody(codePuzzleSubmitBodySchema),
  codePuzzleSubmitHandler,
);

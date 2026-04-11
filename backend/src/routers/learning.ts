import { Router } from "express";
import { learningGetExercisesHandler } from "../controllers/learning/learningGetExercisesHandler.js";
import { learningGetResumeHandler } from "../controllers/learning/learningGetResumeHandler.js";
import { learningSubmitExerciseHandler } from "../controllers/learning/learningSubmitExerciseHandler.js";
import { authMiddleware } from "../middlewares/auth.js";

export const learningRouter = Router();

learningRouter.get("/exercises/:experienceLevel", learningGetExercisesHandler);
learningRouter.post("/submit-exercise", authMiddleware, learningSubmitExerciseHandler);
learningRouter.get("/resume", authMiddleware, learningGetResumeHandler);

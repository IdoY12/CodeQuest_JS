import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getChapters,
  getExercises,
  getLessonResults,
  getLessons,
  getPaths,
  getPersonalizedExercises,
  getResume,
  submitExercise,
} from "../controllers/learningController.js";

export const learningRouter = Router();

learningRouter.get("/paths", getPaths);
learningRouter.get("/chapters/:pathKey", getChapters);
learningRouter.get("/lessons/:chapterId", getLessons);
learningRouter.get("/exercises/:lessonId", getExercises);
learningRouter.get("/personalized/:level", getPersonalizedExercises);
learningRouter.use(authMiddleware);
learningRouter.post("/submit-exercise", submitExercise);
learningRouter.get("/lesson-results/:lessonId", getLessonResults);
learningRouter.get("/resume", getResume);

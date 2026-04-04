import { Router } from "express";
import { learningGetChaptersHandler } from "../controllers/learning/learningGetChaptersHandler.js";
import { learningGetExercisesHandler } from "../controllers/learning/learningGetExercisesHandler.js";
import { learningGetLessonResultsHandler } from "../controllers/learning/learningGetLessonResultsHandler.js";
import { learningGetLessonsHandler } from "../controllers/learning/learningGetLessonsHandler.js";
import { learningGetPathsHandler } from "../controllers/learning/learningGetPathsHandler.js";
import { learningGetPersonalizedHandler } from "../controllers/learning/learningGetPersonalizedHandler.js";
import { learningGetResumeHandler } from "../controllers/learning/learningGetResumeHandler.js";
import { learningSubmitExerciseHandler } from "../controllers/learning/learningSubmitExerciseHandler.js";
import { authMiddleware } from "../middlewares/auth.js";

export const learningRouter = Router();

learningRouter.use(authMiddleware);
learningRouter.get("/paths", learningGetPathsHandler);
learningRouter.get("/chapters/:pathKey", learningGetChaptersHandler);
learningRouter.get("/lessons/:chapterId", learningGetLessonsHandler);
learningRouter.get("/exercises/:lessonId", learningGetExercisesHandler);
learningRouter.get("/personalized/:level", learningGetPersonalizedHandler);
learningRouter.post("/submit-exercise", learningSubmitExerciseHandler);
learningRouter.get("/lesson-results/:lessonId", learningGetLessonResultsHandler);
learningRouter.get("/resume", learningGetResumeHandler);

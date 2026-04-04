/**
 * Authenticated user profile, progress, onboarding, and account management routes.
 *
 * Responsibility: mount user handlers behind authMiddleware.
 * Layer: backend HTTP
 * Depends on: controllers/user/index.js, authMiddleware
 * Consumers: app.ts
 */

import { Router } from "express";
import {
  deleteAccount,
  getAvatarPresignedUrl,
  getDailyGoalStatus,
  getPreferences,
  getProfile,
  getProgressSummary,
  getStreakHistory,
  patchAvatar,
  patchPreferences,
  patchProfile,
  postChangePassword,
  postDailyGoalStatusMarkNotified,
  postOnboarding,
  postPracticeLog,
} from "../controllers/user/index.js";
import { authMiddleware } from "../middlewares/auth.js";

export const userRouter = Router();
userRouter.use(authMiddleware);

userRouter.get("/profile", getProfile);
userRouter.patch("/profile", patchProfile);
userRouter.get("/avatar/presigned-url", getAvatarPresignedUrl);
userRouter.patch("/avatar", patchAvatar);
userRouter.get("/progress-summary", getProgressSummary);
userRouter.post("/onboarding", postOnboarding);
userRouter.get("/preferences", getPreferences);
userRouter.patch("/preferences", patchPreferences);
userRouter.post("/practice-log", postPracticeLog);
userRouter.get("/daily-goal-status/:dateKey", getDailyGoalStatus);
userRouter.post("/daily-goal-status/:dateKey/mark-notified", postDailyGoalStatusMarkNotified);
userRouter.get("/streak-history", getStreakHistory);
userRouter.post("/change-password", postChangePassword);
userRouter.delete("/account", deleteAccount);

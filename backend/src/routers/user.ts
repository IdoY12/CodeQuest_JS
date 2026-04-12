/**
 * Authenticated user profile, progress, onboarding, and account management routes.
 *
 * Responsibility: mount user handlers behind authMiddleware.
 * Layer: backend HTTP
 * Depends on: controllers/user/index.js, authMiddleware
 * Consumers: app.ts
 */

import { raw, Router } from "express";
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
  putAvatarDirectUpload,
} from "../controllers/user/index.js";
import { authMiddleware } from "../middlewares/auth.js";

export const userRouter = Router();
userRouter.use(authMiddleware);

userRouter.get("/profile", getProfile);
userRouter.patch("/profile", patchProfile);
userRouter.get("/avatar/presigned-url", getAvatarPresignedUrl);
// raw() parses the binary image body as a Buffer for this route only.
// The app-level JSON parser skips non-application/json content types.
userRouter.put("/avatar/upload", raw({ type: "image/*", limit: "5mb" }), putAvatarDirectUpload);
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

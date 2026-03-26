import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
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
} from "../controllers/userController.js";

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

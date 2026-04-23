/**
 * Authenticated user profile, progress, preferences, and account management routes.
 *
 * Responsibility: mount user handlers behind authMiddleware.
 * Layer: backend HTTP
 * Depends on: controllers/user/index.js, authMiddleware, validateBody/validateQuery/validateParams middleware, validators/userValidators
 * Consumers: app.ts
 */

import { raw, Router } from "express";
import {
  deleteAccount,
  getDailyGoalStatus,
  getPreferences,
  getProfile,
  getProgressSummary,
  patchAvatar,
  patchPreferences,
  patchProfile,
  postChangePassword,
  postDailyGoalStatusMarkNotified,
  postPracticeLog,
  putAvatarDirectUpload,
} from "../controllers/user/index.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validateBody.js";
import {
  dailyGoalDateKeyParamsSchema,
  deleteAccountBodySchema,
  patchAvatarBodySchema,
  patchPreferencesBodySchema,
  patchProfileBodySchema,
  postChangePasswordBodySchema,
  postDailyGoalMarkNotifiedBodySchema,
  postPracticeLogBodySchema,
  progressSummaryQuerySchema,
} from "../validators/userValidators.js";

export const userRouter = Router();
userRouter.use(authMiddleware);

userRouter.get("/profile", getProfile);
userRouter.patch("/profile", validateBody(patchProfileBodySchema), patchProfile);
// raw() parses the binary image body as a Buffer for this route only.
// The app-level JSON parser skips non-application/json content types.
userRouter.put("/avatar/upload", raw({ type: "image/*", limit: "5mb" }), putAvatarDirectUpload);
userRouter.patch("/avatar", validateBody(patchAvatarBodySchema), patchAvatar);
userRouter.get("/progress-summary", validateQuery(progressSummaryQuerySchema), getProgressSummary);
userRouter.get("/preferences", getPreferences);
userRouter.patch("/preferences", validateBody(patchPreferencesBodySchema), patchPreferences);
userRouter.post("/practice-log", validateBody(postPracticeLogBodySchema), postPracticeLog);
userRouter.get("/daily-goal-status/:dateKey", validateParams(dailyGoalDateKeyParamsSchema), getDailyGoalStatus);
userRouter.post(
  "/daily-goal-status/:dateKey/mark-notified",
  validateParams(dailyGoalDateKeyParamsSchema),
  validateBody(postDailyGoalMarkNotifiedBodySchema),
  postDailyGoalStatusMarkNotified,
);
userRouter.post("/change-password", validateBody(postChangePasswordBodySchema), postChangePassword);
userRouter.delete("/account", validateBody(deleteAccountBodySchema), deleteAccount);

import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { logError, logInfo, logWarn } from "../../utils/logger.js";
import { DATABASE_UNAVAILABLE_MESSAGE, isDatabaseUnavailableError } from "../../utils/dbErrors.js";
import { comparePassword } from "../../utils/passwordHashing.js";
import { signAccessToken, signRefreshToken } from "../../utils/sessionJwtTokens.js";
import { loginBodySchema } from "./authBodySchemas.js";
import { resolveExperienceLevel } from "@project/db";
import {
  ensureDuelRatingRow,
  ensureUserProgressForLogin,
  touchUserLastActive,
} from "./authLoginPersistence.js";

export async function authLoginHandler(request: Request, response: Response): Promise<void> {
  logInfo("[AUTH]", "login:attempt", { email: request.body?.email });
  const parsed = loginBodySchema.safeParse(request.body);
  if (!parsed.success) {
    logWarn("[AUTH]", "login:validation-failed", { errors: parsed.error.flatten() });
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logWarn("[AUTH]", "login:user-not-found", { email });
      response.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const isPasswordValid = await comparePassword(password, user.hashedPassword);
    if (!isPasswordValid) {
      logWarn("[AUTH]", "login:invalid-password", { userId: user.id });
      response.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const progress = await ensureUserProgressForLogin(user);
    await touchUserLastActive(user.id);
    await ensureDuelRatingRow(user.id);
    const pathKey = resolveExperienceLevel(progress.experienceLevel);
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    });
    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    });
    logInfo("[AUTH]", "login:success", { userId: user.id, onboardingCompleted: progress.onboardingCompleted });
    response.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarId: user.avatarId,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: progress.onboardingCompleted,
        pathKey,
        goal: progress.goal,
        experienceLevel: progress.experienceLevel,
        dailyCommitmentMinutes: progress.dailyCommitmentMinutes ?? 15,
        notificationsEnabled: progress.notificationsEnabled ?? true,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logError("[AUTH]", error, { phase: "login" });
    if (isDatabaseUnavailableError(error)) {
      response.status(503).json({ error: DATABASE_UNAVAILABLE_MESSAGE });
      return;
    }
    response.status(500).json({ error: "Login failed" });
  }
}

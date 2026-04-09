import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { logError, logInfo, logWarn } from "../../utils/logger.js";
import {
  DATABASE_UNAVAILABLE_MESSAGE,
  isDatabaseUnavailableError,
  isUniqueConstraintError,
} from "../../utils/dbErrors.js";
import { signAccessToken, signRefreshToken } from "../../utils/sessionJwtTokens.js";
import { registerBodySchema } from "./authBodySchemas.js";
import { createRegisteredUserWithDefaults } from "./authRegisterPersistence.js";

export async function authRegisterHandler(request: Request, response: Response): Promise<void> {
  logInfo("[AUTH]", "register:attempt", { email: request.body?.email, username: request.body?.username });
  const parsed = registerBodySchema.safeParse(request.body);
  if (!parsed.success) {
    logWarn("[AUTH]", "register:validation-failed", { errors: parsed.error.flatten() });
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const { email, username, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      logWarn("[AUTH]", "register:email-exists", { email });
      response.status(409).json({ error: "Email already exists" });
      return;
    }
    const path = await prisma.learningPath.findUnique({ where: { key: "BEGINNER" } });
    if (!path) {
      logWarn("[AUTH]", "register:path-missing");
      response.status(400).json({ error: "Path not found" });
      return;
    }
    const user = await createRegisteredUserWithDefaults({ email, username, password, pathId: path.id });
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      // Stamp the JWT with the same tokenVersion as the User row so later requests compare DB vs claim; bumping the DB invalidates every old token at once (JWTs otherwise stay valid until expiry).
      // Column: packages/db/prisma/models/user.prisma (`User.tokenVersion`, default 0). Bump: backend/src/utils/revokeAllSessionsForUser.ts (e.g. logout), backend/src/controllers/user/postChangePasswordHandler.ts, backend/src/controllers/user/deleteAccountHandler.ts.
      tokenVersion: user.tokenVersion,
    });
    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    });
    logInfo("[AUTH]", "register:success", { userId: user.id, email: user.email });
    response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarId: user.avatarId,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: false,
        pathKey: "BEGINNER",
        goal: null,
        experienceLevel: null,
        dailyCommitmentMinutes: 15,
        notificationsEnabled: true,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logError("[AUTH]", error, { phase: "register" });
    if (isUniqueConstraintError(error, "email")) {
      response.status(409).json({ error: "Email already exists" });
      return;
    }
    if (isDatabaseUnavailableError(error)) {
      response.status(503).json({ error: DATABASE_UNAVAILABLE_MESSAGE });
      return;
    }
    response.status(500).json({ error: "Registration failed" });
  }
}

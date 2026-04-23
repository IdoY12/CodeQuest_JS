import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { logError, logInfo, logWarn } from "../../utils/logger.js";
import {
  DATABASE_UNAVAILABLE_MESSAGE,
  isDatabaseUnavailableError,
  isUniqueConstraintError,
} from "../../utils/dbErrors.js";
import { signAccessToken, signRefreshToken } from "../../utils/sessionJwtTokens.js";
import type { RegisterBody } from "../../validators/authValidators.js";
import { createRegisteredUserWithDefaults } from "./authRegisterPersistence.js";

export async function authRegisterHandler(request: Request, response: Response): Promise<void> {
  const { email, username, password } = request.body as RegisterBody;
  logInfo("[AUTH]", "register:attempt", { email, username });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      logWarn("[AUTH]", "register:email-exists", { email });
      response.status(409).json({ error: "Email already exists" });
      return;
    }
    const user = await createRegisteredUserWithDefaults({ email, username, password });
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
        avatarUrl: user.avatarUrl,
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

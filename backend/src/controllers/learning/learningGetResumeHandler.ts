import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function learningGetResumeHandler(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  try {
    logInfo("[TASKS]", "resume:fetch", { userId: request.user?.userId });
    const progress = await prisma.userProgress.findUnique({ where: { userId: request.user!.userId } });
    response.json(progress);
  } catch (error) {
    logError("[TASKS]", error, { phase: "resume", userId: request.user?.userId });
    response.status(500).json({ error: "Failed to fetch resume" });
  }
}

import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { prisma } from "@project/db";
import { DAILY_CHALLENGE_BONUS_XP } from "../../constants/dailyChallengeConstants.js";
import { logError, logInfo, logWarn } from "../../utils/logger.js";

export async function dailyChallengeSubmitHandler(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  try {
    logInfo("[TASKS]", "daily-challenge:submit-attempt", {
      userId: request.user?.userId,
      exerciseId: request.body?.exerciseId,
    });
    const parsed = z.object({ exerciseId: z.string(), answer: z.string() }).safeParse(request.body);
    if (!parsed.success) {
      logWarn("[TASKS]", "daily-challenge:validation-failed", { userId: request.user?.userId });
      response.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const exercise = await prisma.exercise.findUnique({ where: { id: parsed.data.exerciseId } });
    if (!exercise) {
      response.status(404).json({ error: "Challenge not found" });
      return;
    }
    const isCorrect = exercise.correctAnswer === parsed.data.answer;
    if (isCorrect) {
      await prisma.userProgress.update({
        where: { userId: request.user!.userId },
        data: { xpTotal: { increment: exercise.xpReward + DAILY_CHALLENGE_BONUS_XP } },
      });
    }
    response.json({
      isCorrect,
      xpAwarded: isCorrect ? exercise.xpReward + DAILY_CHALLENGE_BONUS_XP : 0,
    });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-challenge-submit", userId: request.user?.userId });
    response.status(500).json({ error: "Failed to submit daily challenge" });
  }
}

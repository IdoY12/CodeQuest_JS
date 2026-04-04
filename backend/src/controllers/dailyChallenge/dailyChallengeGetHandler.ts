import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { DAILY_CHALLENGE_BONUS_XP } from "../../constants/dailyChallengeConstants.js";
import { mapExerciseRowToClientDto } from "../../dto/mapExerciseRowToClientDto.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function dailyChallengeGetHandler(_request: Request, response: Response): Promise<void> {
  try {
    logInfo("[TASKS]", "daily-challenge:fetch");
    const exercise = await prisma.exercise.findFirst({
      where: { type: "FIND_THE_BUG" },
      include: { options: true },
    });
    if (!exercise) {
      response.status(503).json({ error: "Daily challenge is not configured" });
      return;
    }
    response.json({
      challengeDate: new Date().toISOString().slice(0, 10),
      bonusXp: DAILY_CHALLENGE_BONUS_XP,
      exercise: mapExerciseRowToClientDto(exercise),
    });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-challenge-get" });
    response.status(500).json({ error: "Failed to load daily challenge" });
  }
}

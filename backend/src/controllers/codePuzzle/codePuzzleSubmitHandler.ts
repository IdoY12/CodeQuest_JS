/**
 * Validates a submitted answer against the puzzle's acceptedAnswers array.
 * Optional Bearer auth: when present and answer is correct, persists XP + streak for the signed-in user.
 *
 * Responsibility: answer normalisation, correctness check, optional progress write.
 * Layer: backend code-puzzles controller
 * Consumers: codePuzzles router
 */

import type { Response } from "express";
import {
  activeExperienceLevelOf,
  ensureProgressRow,
  getProgressForActiveUser,
  handleStreakQualifyingXpForUser,
  prisma,
} from "@project/db";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import type { CodePuzzleSubmitDto } from "../../dto/codePuzzleDto.js";
import { logError } from "../../utils/logger.js";
import type { CodePuzzleSubmitBody, CodePuzzleSubmitParams } from "../../validators/codePuzzleValidators.js";

function normalizeAnswer(value: string): string {
  return value.replace(/\s+/g, "").trim().replace(/;$/, "");
}

export async function codePuzzleSubmitHandler(request: AuthenticatedRequest, response: Response): Promise<void> {
  try {
    const { id } = request.validatedParams as CodePuzzleSubmitParams;
    const { answer, clientLocalDate } = request.body as CodePuzzleSubmitBody;

    if (!answer.trim()) {
      response.status(400).json({ error: "answer is required" });
      return;
    }
    const puzzle = await prisma.codePuzzle.findUnique({ where: { id } });

    if (!puzzle) {
      response.status(404).json({ error: "Puzzle not found" });
      return;
    }
    const normalizedInput = normalizeAnswer(answer);
    const isAnswerCorrect = puzzle.acceptedAnswers.some(
      (accepted) => normalizeAnswer(accepted) === normalizedInput,
    );

    const userId = request.user?.userId;
    let streakCurrent: number | undefined;
    let xpTotal: number | undefined;

    if (isAnswerCorrect && userId && clientLocalDate) {
      const level = await activeExperienceLevelOf(prisma, userId);
      await ensureProgressRow(prisma, userId, level);
      const progress = await getProgressForActiveUser(prisma, userId);
      if (progress) {
        const nextXp = progress.xpTotal + XP_PER_CORRECT_EXERCISE;
        const nextLevel = Math.max(1, Math.floor(nextXp / XP_PER_CORRECT_EXERCISE) + 1);
        await prisma.userProgress.update({
          where: { id: progress.id },
          data: { xpTotal: nextXp, level: nextLevel },
        });
        streakCurrent = await handleStreakQualifyingXpForUser(prisma, userId, clientLocalDate, XP_PER_CORRECT_EXERCISE);
        xpTotal = nextXp;
      }
    }

    const body: CodePuzzleSubmitDto = {
      correct: isAnswerCorrect,
      ...(streakCurrent !== undefined ? { streakCurrent } : {}),
      ...(xpTotal !== undefined ? { xpTotal } : {}),
    };
    response.json(body);
  } catch (error) {
    logError("[TASKS]", error, { phase: "code-puzzle-submit" });
    response.status(500).json({ error: "Failed to submit answer" });
  }
}

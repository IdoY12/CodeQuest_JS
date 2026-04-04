import type { Response } from "express";
import { prisma } from "@project/db";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function learningGetLessonResultsHandler(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  try {
    logInfo("[TASKS]", "lesson-results:fetch", {
      userId: request.user?.userId,
      lessonId: request.params.lessonId,
    });
    const lessonId = String(request.params.lessonId);
    const history = await prisma.userExerciseHistory.findMany({
      where: { userId: request.user!.userId, exercise: { lessonId } },
    });
    const total = history.length;
    const correct = history.filter((entry) => entry.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    response.json({ total, correct, accuracy });
  } catch (error) {
    logError("[TASKS]", error, { phase: "lesson-results", userId: request.user?.userId });
    response.status(500).json({ error: "Failed to load lesson results" });
  }
}

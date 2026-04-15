import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../../@types/auth.js";
import { logError, logInfo } from "../../utils/logger.js";
import { applyExerciseSubmission } from "./applyExerciseSubmission.js";

export async function learningSubmitExerciseHandler(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  try {
    logInfo("[TASKS]", "exercise:submit-attempt", {
      userId: request.user?.userId,
      exerciseId: request.body?.exerciseId,
    });
    const parsed = z
      .object({
        exerciseId: z.string().min(3),
        answer: z.string(),
      })
      .safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const result = await applyExerciseSubmission({
      userId: request.user!.userId,
      exerciseId: parsed.data.exerciseId,
      answer: parsed.data.answer,
    });

    if (!result) {
      response.status(404).json({ error: "Exercise not found" });
      return;
    }
    response.json(result);
  } catch (error) {
    logError("[TASKS]", error, { phase: "submit-exercise", userId: request.user?.userId });
    response.status(500).json({ error: "Failed to submit exercise" });
  }
}

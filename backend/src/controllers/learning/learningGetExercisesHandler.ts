import type { Response } from "express";
import type { Request } from "express";
import { prisma } from "@project/db";
import { mapExerciseRowToClientDto } from "../../dto/mapExerciseRowToClientDto.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function learningGetExercisesHandler(request: Request, response: Response): Promise<void> {
  try {
    logInfo("[TASKS]", "exercises:fetch", { lessonId: request.params.lessonId });
    const exercises = await prisma.exercise.findMany({
      where: { lessonId: String(request.params.lessonId) },
      orderBy: { orderIndex: "asc" },
      include: { options: true },
    });
    response.json(exercises.map(mapExerciseRowToClientDto));
  } catch (error) {
    logError("[TASKS]", error, { phase: "learning-exercises", lessonId: request.params.lessonId });
    response.status(500).json({ error: "Failed to load exercises" });
  }
}

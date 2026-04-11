import type { Response } from "express";
import type { Request } from "express";
import { prisma } from "@project/db";
import type { ExperienceLevel } from "@prisma/client";
import { mapExerciseRowToClientDto } from "../../dto/mapExerciseRowToClientDto.js";
import { logError, logInfo } from "../../utils/logger.js";

const levels: ExperienceLevel[] = ["JUNIOR", "MID", "SENIOR"];

export async function learningGetExercisesHandler(request: Request, response: Response): Promise<void> {
  try {
    const raw = String(request.params.experienceLevel ?? "").toUpperCase();
    const experienceLevel = (levels.includes(raw as ExperienceLevel) ? raw : "JUNIOR") as ExperienceLevel;
    logInfo("[TASKS]", "exercises:fetch", { experienceLevel });
    const exercises = await prisma.exercise.findMany({
      where: { experienceLevel },
      orderBy: { orderIndex: "asc" },
      include: { options: true },
    });
    response.json(exercises.map(mapExerciseRowToClientDto));
  } catch (error) {
    logError("[TASKS]", error, { phase: "learning-exercises", experienceLevel: request.params.experienceLevel });
    response.status(500).json({ error: "Failed to load exercises" });
  }
}

import type { Response } from "express";
import type { Request } from "express";
import { z } from "zod";
import { prisma } from "@project/db";
import { mapPersonalizedExerciseToClientDto } from "../../dto/mapPersonalizedExerciseToClientDto.js";
import { logError, logInfo } from "../../utils/logger.js";

const personalizationLevelSchema = z.enum(["BEGINNER", "BASICS", "INTERMEDIATE", "ADVANCED"]);

export async function learningGetPersonalizedHandler(request: Request, response: Response): Promise<void> {
  try {
    const levelResult = personalizationLevelSchema.safeParse(request.params.level);
    if (!levelResult.success) {
      response.status(400).json({ error: "Invalid personalization level" });
      return;
    }
    const level = levelResult.data;
    logInfo("[TASKS]", "personalized-exercises:fetch", { level });
    const rows = await prisma.personalizedExercise.findMany({
      where: { level },
      orderBy: { orderIndex: "asc" },
    });
    response.json(rows.map(mapPersonalizedExerciseToClientDto));
  } catch (error) {
    logError("[TASKS]", error, { phase: "learning-personalized", level: request.params.level });
    response.status(500).json({ error: "Failed to load personalized exercises" });
  }
}

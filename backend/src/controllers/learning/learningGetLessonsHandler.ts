import type { Response } from "express";
import type { Request } from "express";
import { prisma } from "@project/db";
import { logError, logInfo } from "../../utils/logger.js";

export async function learningGetLessonsHandler(request: Request, response: Response): Promise<void> {
  try {
    logInfo("[TASKS]", "lessons:fetch", { chapterId: request.params.chapterId });
    const lessons = await prisma.lesson.findMany({
      where: { chapterId: String(request.params.chapterId) },
      orderBy: { orderIndex: "asc" },
    });
    response.json(lessons);
  } catch (error) {
    logError("[TASKS]", error, { phase: "learning-lessons", chapterId: request.params.chapterId });
    response.status(500).json({ error: "Failed to load lessons" });
  }
}

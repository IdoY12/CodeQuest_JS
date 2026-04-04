import type { Response } from "express";
import type { Request } from "express";
import { prisma } from "@project/db";
import { logError, logInfo } from "../../utils/logger.js";

export async function learningGetChaptersHandler(request: Request, response: Response): Promise<void> {
  try {
    logInfo("[TASKS]", "chapters:fetch", { pathKey: request.params.pathKey });
    const path = await prisma.learningPath.findUnique({
      where: { key: request.params.pathKey as "BEGINNER" | "ADVANCED" },
    });
    if (!path) {
      response.status(404).json({ error: "Path not found" });
      return;
    }
    const chapters = await prisma.chapter.findMany({
      where: { pathId: path.id },
      orderBy: { orderIndex: "asc" },
    });
    response.json(chapters);
  } catch (error) {
    logError("[TASKS]", error, { phase: "learning-chapters", pathKey: request.params.pathKey });
    response.status(500).json({ error: "Failed to load chapters" });
  }
}

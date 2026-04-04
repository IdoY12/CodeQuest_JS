import type { Response } from "express";
import type { Request } from "express";
import { prisma } from "@project/db";
import { logError } from "../../utils/logger.js";

export async function learningGetPathsHandler(_request: Request, response: Response): Promise<void> {
  try {
    const paths = await prisma.learningPath.findMany();
    response.json(paths);
  } catch (error) {
    logError("[TASKS]", error, { phase: "learning-paths" });
    response.status(500).json({ error: "Failed to load learning paths" });
  }
}

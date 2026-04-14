/**
 * Returns every code puzzle sorted by orderIndex — one request replaces all prev/next calls.
 *
 * Responsibility: bulk fetch for client-side navigation.
 * Layer: backend code-puzzles controller
 * Depends on: @project/db (prisma), CodePuzzleDto
 * Consumers: codePuzzles router
 */

import type { Request, Response } from "express";
import { prisma } from "@project/db";
import type { CodePuzzleDto } from "../../dto/codePuzzleDto.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function codePuzzleAllHandler(_request: Request, response: Response): Promise<void> {
  try {
    logInfo("[TASKS]", "code-puzzle:all");
    const puzzles = await prisma.codePuzzle.findMany({
      orderBy: { orderIndex: "asc" },
      select: { id: true, prompt: true, orderIndex: true },
    });
    const body: CodePuzzleDto[] = puzzles;
    response.json(body);
  } catch (error) {
    logError("[TASKS]", error, { phase: "code-puzzle-all" });
    response.status(500).json({ error: "Failed to load puzzles" });
  }
}

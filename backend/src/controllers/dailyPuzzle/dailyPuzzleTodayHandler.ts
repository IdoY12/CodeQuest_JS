import type { Request, Response } from "express";
import { pickDailyPuzzleIndex } from "@project/daily-puzzles";
import { prisma } from "@project/db";
import type { ClientPuzzleTodayDto } from "../../dto/clientPuzzleTodayDto.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function dailyPuzzleTodayHandler(request: Request, response: Response): Promise<void> {
  try {
    logInfo("[TASKS]", "daily-puzzle:today");
    const puzzles = await prisma.dailyPuzzle.findMany({ orderBy: { orderIndex: "asc" } });
    if (puzzles.length === 0) {
      response.status(503).json({ error: "Daily puzzles are not configured" });
      return;
    }
    const dateQuery = request.query.date as string | undefined;
    const anchor = dateQuery ? new Date(`${dateQuery}T12:00:00Z`) : new Date();
    const index = pickDailyPuzzleIndex(puzzles.length, anchor);
    const row = puzzles[index];
    const puzzle: ClientPuzzleTodayDto = { id: row.id, prompt: row.prompt };
    response.json({
      puzzle,
      puzzleIndex: index,
      puzzleDate: anchor.toISOString().slice(0, 10),
    });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-today" });
    response.status(500).json({ error: "Failed to load daily puzzle" });
  }
}

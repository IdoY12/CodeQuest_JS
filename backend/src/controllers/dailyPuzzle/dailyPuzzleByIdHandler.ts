/**
 * Returns a specific puzzle by its database id — used for prev/next navigation.
 *
 * Responsibility: fetch a single DailyPuzzle row and its adjacent ids.
 * Layer: backend daily-puzzles controller
 * Depends on: @project/db (prisma), DailyPuzzleDto
 * Consumers: dailyPuzzles router
 */

import type { Request, Response } from "express";
import { prisma } from "@project/db";
import type { DailyPuzzleDto } from "../../dto/clientPuzzleTodayDto.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function dailyPuzzleByIdHandler(request: Request, response: Response): Promise<void> {
  try {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({ error: "Invalid puzzle id" });
      return;
    }
    logInfo("[TASKS]", "daily-puzzle:by-id", { id });
    const totalCount = await prisma.dailyPuzzle.count();
    const puzzle = await prisma.dailyPuzzle.findUnique({ where: { id } });
    if (!puzzle) {
      response.status(404).json({ error: "Puzzle not found" });
      return;
    }
    const prevPuzzle =
      puzzle.orderIndex > 0
        ? await prisma.dailyPuzzle.findUnique({ where: { orderIndex: puzzle.orderIndex - 1 } })
        : null;
    const nextPuzzle =
      puzzle.orderIndex < totalCount - 1
        ? await prisma.dailyPuzzle.findUnique({ where: { orderIndex: puzzle.orderIndex + 1 } })
        : null;
    const body: DailyPuzzleDto = {
      id: puzzle.id,
      prompt: puzzle.prompt,
      orderIndex: puzzle.orderIndex,
      totalCount,
      prevId: prevPuzzle?.id ?? null,
      nextId: nextPuzzle?.id ?? null,
    };
    response.json(body);
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-by-id" });
    response.status(500).json({ error: "Failed to load puzzle" });
  }
}

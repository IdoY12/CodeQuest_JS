/**
 * Validates a submitted answer against the puzzle's acceptedAnswers array.
 *
 * Responsibility: answer normalisation and correctness check against DB data.
 * Layer: backend daily-puzzles controller
 * Depends on: @project/db (prisma), DailyPuzzleSubmitDto
 * Consumers: dailyPuzzles router
 */

import type { Request, Response } from "express";
import { prisma } from "@project/db";
import type { DailyPuzzleSubmitDto } from "../../dto/clientPuzzleTodayDto.js";
import { logError } from "../../utils/logger.js";

function normalizeAnswer(value: string): string {
  return value.replace(/\s+/g, "").trim().replace(/;$/, "");
}

export async function dailyPuzzleSubmitHandler(request: Request, response: Response): Promise<void> {
  try {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({ error: "Invalid puzzle id" });
      return;
    }
    const answer = String((request.body as { answer?: unknown })?.answer ?? "");
    if (!answer.trim()) {
      response.status(400).json({ error: "answer is required" });
      return;
    }
    const puzzle = await prisma.dailyPuzzle.findUnique({ where: { id } });
    if (!puzzle) {
      response.status(404).json({ error: "Puzzle not found" });
      return;
    }
    const normalizedInput = normalizeAnswer(answer);
    const correct = puzzle.acceptedAnswers.some(
      (accepted) => normalizeAnswer(accepted) === normalizedInput,
    );
    const body: DailyPuzzleSubmitDto = { correct };
    response.json(body);
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-submit" });
    response.status(500).json({ error: "Failed to submit answer" });
  }
}

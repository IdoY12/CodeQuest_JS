import type { Request, Response } from "express";
import { isPuzzleAnswerCorrect } from "@project/daily-puzzles";
import { prisma } from "@project/db";
import { logError } from "../../utils/logger.js";

export async function dailyPuzzleValidateHandler(request: Request, response: Response): Promise<void> {
  try {
    const parsed: { puzzleId?: string; answer?: string } = request.body ?? {};
    const puzzleId = String(parsed.puzzleId ?? "");
    const answer = String(parsed.answer ?? "");
    if (!puzzleId) {
      response.status(400).json({ error: "puzzleId is required" });
      return;
    }
    const row = await prisma.dailyPuzzle.findUnique({ where: { id: puzzleId } });
    if (!row) {
      response.status(404).json({ error: "Puzzle not found" });
      return;
    }
    const acceptedAnswers = row.acceptedAnswers as string[];
    const isCorrect = isPuzzleAnswerCorrect({ id: row.id, prompt: row.prompt, acceptedAnswers }, answer);
    response.json({ isCorrect, puzzleId: row.id });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-validate" });
    response.status(500).json({ error: "Failed to validate answer" });
  }
}

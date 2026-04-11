import type { Request, Response } from "express";
import { dailyPuzzleBank, isPuzzleAnswerCorrect } from "@project/daily-puzzles";
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
    const row = dailyPuzzleBank.find((p) => p.id === puzzleId);
    if (!row) {
      response.status(404).json({ error: "Puzzle not found" });
      return;
    }
    const isCorrect = isPuzzleAnswerCorrect(row, answer);
    response.json({ isCorrect, puzzleId: row.id });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-validate" });
    response.status(500).json({ error: "Failed to validate answer" });
  }
}

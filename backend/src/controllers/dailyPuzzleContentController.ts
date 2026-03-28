import type { Request, Response } from "express";
import { prisma } from "@project/db";
import { logError, logInfo } from "../utils/logger.js";
import { isPuzzleResponseCorrect, pickDailyPuzzleIndex } from "../utils/puzzleAnswerNormalize.js";

export async function getDailyPuzzleToday(req: Request, res: Response) {
  try {
    logInfo("[TASKS]", "daily-puzzle:today");
    const puzzles = await prisma.dailyPuzzle.findMany({ orderBy: { orderIndex: "asc" } });
    if (puzzles.length === 0) {
      return res.status(503).json({ error: "Daily puzzles are not configured" });
    }
    const q = req.query.date as string | undefined;
    const anchor = q ? new Date(`${q}T12:00:00Z`) : new Date();
    const index = pickDailyPuzzleIndex(puzzles.length, anchor);
    const row = puzzles[index];
    const acceptedAnswers = row.acceptedAnswers as string[];
    return res.json({
      puzzle: {
        id: row.id,
        prompt: row.prompt,
        acceptedAnswers,
      },
      puzzleIndex: index,
      puzzleDate: anchor.toISOString().slice(0, 10),
    });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-today" });
    return res.status(500).json({ error: "Failed to load daily puzzle" });
  }
}

export async function validateDailyPuzzleAnswer(req: Request, res: Response) {
  try {
    const parsed: { puzzleId?: string; answer?: string } = req.body ?? {};
    const puzzleId = String(parsed.puzzleId ?? "");
    const answer = String(parsed.answer ?? "");
    if (!puzzleId) {
      return res.status(400).json({ error: "puzzleId is required" });
    }
    const row = await prisma.dailyPuzzle.findUnique({ where: { id: puzzleId } });
    if (!row) {
      return res.status(404).json({ error: "Puzzle not found" });
    }
    const acceptedAnswers = row.acceptedAnswers as string[];
    const ok = isPuzzleResponseCorrect(acceptedAnswers, answer);
    return res.json({ isCorrect: ok, puzzleId: row.id });
  } catch (error) {
    logError("[TASKS]", error, { phase: "daily-puzzle-validate" });
    return res.status(500).json({ error: "Failed to validate answer" });
  }
}

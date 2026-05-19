import type { Prisma } from "@prisma/client";
import type { PuzzleXpSolveCounts } from "@project/xp-constants";

export function parsePuzzleXpSolveCounts(raw: Prisma.JsonValue | null | undefined): PuzzleXpSolveCounts {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value >= 0)
      .map(([key, value]) => [key, Math.floor(value as number)]),
  );
}

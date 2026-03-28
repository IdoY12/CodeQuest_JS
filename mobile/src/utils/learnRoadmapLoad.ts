import { apiRequest } from "../services/api";
import { logError, logTasks } from "../services/logger";
import type { ApiChapter } from "../types/learn.types";

type PathKey = string;

export async function fetchLearnChapters(path: PathKey): Promise<ApiChapter[]> {
  return apiRequest<ApiChapter[]>(`/learning/chapters/${path}`);
}

export function logChaptersLoaded(path: PathKey, count: number): void {
  logTasks("chapters:loaded", { path, count });
}

export function logChaptersError(path: PathKey, error: unknown): void {
  logError("[TASKS]", error, { phase: "load-chapters", path });
}

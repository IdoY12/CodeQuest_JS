import { apiRequest } from "../services/api";
import { logError, logTasks } from "../services/logger";
import type Chapter from "@/models/Chapter";

type PathKey = string;

export async function fetchLearnChapters(path: PathKey, accessToken: string | null): Promise<Chapter[]> {
  if (!accessToken) {
    logTasks("chapters:skip-no-token", { path });
    return [];
  }
  return apiRequest<Chapter[]>(`/learning/chapters/${path}`, { token: accessToken });
}

export function logChaptersLoaded(path: PathKey, count: number): void {
  logTasks("chapters:loaded", { path, count });
}

export function logChaptersError(path: PathKey, error: unknown): void {
  logError("[TASKS]", error, { phase: "load-chapters", path });
}

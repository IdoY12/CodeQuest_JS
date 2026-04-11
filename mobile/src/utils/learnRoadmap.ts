import { logError, logTasks } from "@/utils/logger";

type PathKey = string;

export function logChaptersSkipNoToken(path: PathKey): void {
  logTasks("chapters:skip-no-token", { path });
}

export function logChaptersLoaded(path: PathKey, count: number): void {
  logTasks("chapters:loaded", { path, count });
}

export function logChaptersError(path: PathKey, error: unknown): void {
  logError("[TASKS]", error, { phase: "load-chapters", path });
}

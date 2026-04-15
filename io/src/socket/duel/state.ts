import type { QueueEntry, SessionState } from "./types.js";

export const queue: QueueEntry[] = [];

export const sessions = new Map<string, SessionState>();

import type { QueueEntry, SessionState } from "./types.js";

export const queue: QueueEntry[] = [];

export const sessions = new Map<string, SessionState>();

/** When still alone after {@link SOLO_MATCH_WAIT_MS}, start a solo session (see queue.ts). */
export const soloMatchTimers = new Map<string, ReturnType<typeof setTimeout>>();

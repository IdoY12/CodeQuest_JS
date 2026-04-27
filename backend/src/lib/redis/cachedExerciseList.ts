/**
 * Redis cache for the JSON payload of GET /learning/exercises/:experienceLevel (24h TTL).
 * All operations fail silently so the HTTP handler can always fall back to Postgres.
 */

import type { ExperienceLevel } from "@prisma/client";
import { getRedisClient } from "./redisClient.js";

const CACHED_EXERCISE_LIST_TTL_SECONDS = 86400;

function exerciseListCacheKey(experienceLevel: ExperienceLevel): string {
  return `exercises:${experienceLevel}`;
}

export async function readCachedExerciseListJson(experienceLevel: ExperienceLevel): Promise<string | null> {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    return await redis.get(exerciseListCacheKey(experienceLevel));
  } catch {
    return null;
  }
}

export async function writeCachedExerciseListJson(experienceLevel: ExperienceLevel, json: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.setex(exerciseListCacheKey(experienceLevel), CACHED_EXERCISE_LIST_TTL_SECONDS, json);
  } catch {
    /* ignore — DB path already succeeded */
  }
}

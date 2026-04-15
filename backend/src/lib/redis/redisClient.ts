/**
 * Optional Redis connection for caching. When `redis.url` is empty or unset, returns null.
 * Failures during construction are swallowed so callers can fall back to other stores.
 */

import config from "config";
import { Redis } from "ioredis";

let client: Redis | null | undefined;

export function getRedisClient(): Redis | null {
  if (client !== undefined) {
    return client;
  }
  const url = config.has("redis.url") ? String(config.get("redis.url")).trim() : "";
  if (!url) {
    client = null;
    return client;
  }
  try {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    });
  } catch {
    client = null;
  }
  return client;
}

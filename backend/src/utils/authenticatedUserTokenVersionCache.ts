import NodeCache from "node-cache";

const authenticatedUserTokenVersionCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
  useClones: false,
});

export function readCachedTokenVersionForUser(userId: string): number | undefined {
  return authenticatedUserTokenVersionCache.get<number>(userId);
}

export function writeCachedTokenVersionForUser(userId: string, tokenVersion: number): void {
  authenticatedUserTokenVersionCache.set(userId, tokenVersion);
}

export function invalidateCachedTokenVersionForUser(userId: string): void {
  authenticatedUserTokenVersionCache.del(userId);
}

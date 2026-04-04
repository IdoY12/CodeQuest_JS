/**
 * Resolves a chapter title from the seed map or throws a deterministic error.
 *
 * Responsibility: fail fast when curriculum data references a missing chapter.
 * Layer: backend prisma seed
 * Depends on: none
 * Consumers: seed lesson blocks, runMain.ts
 */

export function requireChapterId(map: Map<string, string>, title: string): string {
  const id = map.get(title);
  if (id === undefined) {
    throw new Error(`Seed: chapter not found: ${title}`);
  }
  return id;
}

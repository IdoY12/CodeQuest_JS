/**
 * Maps onboarding experience levels onto persisted learning path keys.
 *
 * Responsibility: collapse BASICS into BEGINNER path for storage.
 * Layer: backend user controllers
 * Depends on: none
 * Consumers: onboarding and preferences handlers
 */

export function resolvePathKey(level: "JUNIOR" | "MID" | "SENIOR"): "BEGINNER" | "ADVANCED" {
  return level === "JUNIOR" || level === "MID" ? "BEGINNER" : "ADVANCED";
}

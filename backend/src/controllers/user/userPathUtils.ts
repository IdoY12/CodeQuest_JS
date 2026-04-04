/**
 * Maps onboarding experience levels onto persisted learning path keys.
 *
 * Responsibility: collapse BASICS into BEGINNER path for storage.
 * Layer: backend user controllers
 * Depends on: none
 * Consumers: onboarding and preferences handlers
 */

export function resolvePathKey(level: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED"): "BEGINNER" | "ADVANCED" {
  return level === "BEGINNER" || level === "BASICS" ? "BEGINNER" : "ADVANCED";
}

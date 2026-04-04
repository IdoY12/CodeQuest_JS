/**
 * Re-exports personalized warm-up exercise data from the shared monorepo package.
 *
 * Responsibility: single source of truth for mobile + API seed content.
 * Layer: mobile data facade
 * Depends on: @project/personalized-exercises
 * Consumers: lesson hooks, roadmap navigation, types
 */

export type { PersonalizationLevel, PersonalizedExercise } from "@project/personalized-exercises";
export { getExercisePoolForLevel } from "@project/personalized-exercises";

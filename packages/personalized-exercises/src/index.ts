/**
 * Entry for personalized warm-up exercise content shared by API seed and mobile UI.
 *
 * Responsibility: re-export types and pool accessor for consumers.
 * Layer: @project/personalized-exercises
 * Depends on: personalizationTypes, exercisePools
 * Consumers: mobile, backend prisma seed
 */

export type { PersonalizationLevel, PersonalizedExercise } from "./personalizationTypes.js";
export { getExercisePoolForLevel } from "./exercisePools.js";

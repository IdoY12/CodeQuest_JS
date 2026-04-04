/**
 * Validates personalized pools then exposes getExercisePoolForLevel.
 *
 * Responsibility: assemble levels, enforce counts and id uniqueness.
 * Layer: @project/personalized-exercises
 * Depends on: personalizationTypes, buildMcqFromSpec, *Specs
 * Consumers: package index, prisma seed, mobile app
 */

import type { PersonalizationLevel, PersonalizedExercise } from "./personalizationTypes.js";
import { build, copyExercises } from "./buildMcqFromSpec.js";
import { beginnerSpecs } from "./beginnerSpecs.js";
import { basicsSpecs } from "./basicsSpecs.js";
import { intermediateSpecs } from "./intermediateSpecs.js";
import { advancedSpecs } from "./advancedSpecs.js";

const exerciseSets: Record<PersonalizationLevel, PersonalizedExercise[]> = {
  BEGINNER: beginnerSpecs.map(build),
  BASICS: basicsSpecs.map(build),
  INTERMEDIATE: intermediateSpecs.map(build),
  ADVANCED: advancedSpecs.map(build),
};

function assertUniqueAndSizedPools() {
  const levels: PersonalizationLevel[] = ["BEGINNER", "BASICS", "INTERMEDIATE", "ADVANCED"];
  const seenIds = new Set<string>();
  for (const level of levels) {
    const list = exerciseSets[level];
    if (list.length !== 30) {
      throw new Error(`Exercise pool for ${level} must contain exactly 30 items.`);
    }
    for (const exercise of list) {
      if (seenIds.has(exercise.id)) {
        throw new Error(`Duplicate exercise id found across levels: ${exercise.id}`);
      }
      seenIds.add(exercise.id);
    }
  }
}

assertUniqueAndSizedPools();

export function getExercisePoolForLevel(level: PersonalizationLevel): PersonalizedExercise[] {
  return copyExercises(exerciseSets[level]);
}

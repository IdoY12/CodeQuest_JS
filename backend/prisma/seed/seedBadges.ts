/**
 * Seeds default achievement badge definitions for gamification features.
 *
 * Responsibility: static badge rows after curriculum and duel content exist.
 * Layer: backend prisma seed
 * Depends on: @prisma/client
 * Consumers: runMain.ts
 */

import type { PrismaClient } from "@prisma/client";

export async function seedBadges(prisma: PrismaClient): Promise<void> {
  await prisma.badge.createMany({
    data: [
      { name: "Week Warrior", description: "Maintain a 7-day streak", iconKey: "week-warrior", category: "Consistency", unlockConditionJson: '{"streak":7}' },
      { name: "Month Master", description: "Maintain a 30-day streak", iconKey: "month-master", category: "Consistency", unlockConditionJson: '{"streak":30}' },
      { name: "Loop Lord", description: "Complete Loops chapter", iconKey: "loop-lord", category: "Learning", unlockConditionJson: '{"chapter":"Loops"}' },
      { name: "Async Ace", description: "Complete Async chapter", iconKey: "async-ace", category: "Learning", unlockConditionJson: '{"chapter":"Async"}' },
      { name: "First Blood", description: "Win your first duel", iconKey: "first-blood", category: "Duel", unlockConditionJson: '{"duelWins":1}' },
      { name: "Unbeatable", description: "Win 5 duels in a row", iconKey: "unbeatable", category: "Duel", unlockConditionJson: '{"duelStreak":5}' },
      { name: "Champion", description: "Reach Gold rank", iconKey: "champion", category: "Duel", unlockConditionJson: '{"tier":"GOLD"}' },
      { name: "Speed Coder", description: "Answer in under 2 seconds", iconKey: "speed-coder", category: "Speed", unlockConditionJson: '{"answerMs":2000}' },
      { name: "Lightning", description: "Five consecutive fast answers", iconKey: "lightning", category: "Speed", unlockConditionJson: '{"fastAnswers":5}' },
      { name: "Puzzle Solved", description: "Solve the Daily Code Puzzle", iconKey: "puzzle-solved", category: "Learning", unlockConditionJson: '{"dailyPuzzle":1}' },
    ],
  });
}

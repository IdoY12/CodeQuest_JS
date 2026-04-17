/**
 * Server streak persistence — rule math lives in @project/streak-logic; mutations in @project/db.
 */
export {
  handleStreakAppOpenForUser as handleStreakAppOpen,
  handleStreakQualifyingXpForUser as handleStreakQualifyingXp,
} from "@project/db";

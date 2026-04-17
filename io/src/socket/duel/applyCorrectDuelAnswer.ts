/**
 * Updates session score/replay, broadcasts round_result, and schedules next round or end.
 *
 * Responsibility: shared path after a participant submits the correct answer.
 * Layer: io duel session
 * Depends on: DUEL_ROUND_COUNT, BETWEEN_DUEL_ROUNDS_DELAY_MS, endSession, startRound
 * Consumers: submitAnswer handler
 */

import type { DuelQuestion } from "@prisma/client";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { BETWEEN_DUEL_ROUNDS_DELAY_MS, DUEL_ROUND_COUNT } from "../../constants/duelRoundConstants.js";
import { applyXpReward } from "./rewards.js";
import { endSession, startRound } from "./session.js";
import { sessions } from "./state.js";
import type { DuelNamespace, SessionState } from "./types.js";

export function applyCorrectDuelAnswer(
  duel: DuelNamespace,
  session: SessionState,
  question: DuelQuestion,
  answeredByPlayer1: boolean,
  timeTakenMs: number,
): void {
  session.answered = true;

  if (session.roundTimeout) {
    clearTimeout(session.roundTimeout);
    session.roundTimeout = null;
  }

  const player1TimeMs = answeredByPlayer1 ? timeTakenMs : 0;
  const player2TimeMs = answeredByPlayer1 ? 0 : timeTakenMs;

  if (answeredByPlayer1) {
    session.score.player1 += 1;
    session.xpGrantedP1 += XP_PER_CORRECT_EXERCISE;
  } else {
    session.score.player2 += 1;
    session.xpGrantedP2 += XP_PER_CORRECT_EXERCISE;
  }
  const xpUserId = answeredByPlayer1 ? session.player1.userId : session.player2.userId;
  const xpStreakDate = answeredByPlayer1 ? session.player1StreakLocalDate : session.player2StreakLocalDate;
  void applyXpReward(xpUserId, XP_PER_CORRECT_EXERCISE, xpStreakDate);
  session.roundReplay.push({
    roundNumber: session.round,
    winnerUserId: answeredByPlayer1 ? session.player1.userId : session.player2.userId,
    correctAnswer: question.correctAnswer,
    player1TimeMs,
    player2TimeMs,
  });
  duel.to(session.roomId).emit("round_result", {
    winner_user_id: answeredByPlayer1 ? session.player1.userId : session.player2.userId,
    correct_answer: question.correctAnswer,
    explanation: question.explanation,
    scores: { player1: session.score.player1, player2: session.score.player2 },
    player_ids: { player1: session.player1.userId, player2: session.player2.userId },
    response_times: { player1_ms: player1TimeMs, player2_ms: player2TimeMs },
  });

  if (session.round >= DUEL_ROUND_COUNT) {
    void endSession(duel, session);
    return;
  }
  setTimeout(() => {
    if (sessions.has(session.sessionId)) {
      void startRound(duel, session);
    }
  }, BETWEEN_DUEL_ROUNDS_DELAY_MS);
}

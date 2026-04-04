/**
 * Schedules duel round expiry: broadcast result, append replay, end or continue.
 *
 * Responsibility: timer callback without importing startRound (avoids circular deps).
 * Layer: io duel session
 * Depends on: DUEL_ROUND_COUNT, DUEL_ROUND_TIMEOUT_MS, endSession
 * Consumers: startRound.ts
 */

import { DUEL_ROUND_COUNT, DUEL_ROUND_TIMEOUT_MS } from "../../constants/duelRoundConstants.js";
import type { DuelNamespace, SessionState } from "./types.js";
import { endSession } from "./endSession.js";

type QuestionShape = { correctAnswer: string };

export function attachRoundTimeout(
  io: DuelNamespace,
  session: SessionState,
  question: QuestionShape,
  nonce: number,
  scheduleNextRound: () => Promise<void>,
): ReturnType<typeof setTimeout> {
  return setTimeout(async () => {
    if (session.roundNonce !== nonce) return;
    if (session.answered) return;
    io.to(session.roomId).emit("round_result", {
      winner_user_id: null,
      correct_answer: question.correctAnswer,
      explanation: "No one answered correctly in time.",
      scores: { player1: session.score.player1, player2: session.score.player2 },
      player_ids: { player1: session.player1.userId, player2: session.player2.userId },
      response_times: { player1_ms: 0, player2_ms: 0 },
    });
    session.roundReplay.push({
      roundNumber: session.round,
      winnerUserId: null,
      correctAnswer: question.correctAnswer,
      player1TimeMs: 0,
      player2TimeMs: 0,
    });
    if (session.round >= DUEL_ROUND_COUNT) {
      await endSession(io, session);
      return;
    }
    if (session.roundNonce === nonce) {
      await scheduleNextRound();
    }
  }, DUEL_ROUND_TIMEOUT_MS);
}

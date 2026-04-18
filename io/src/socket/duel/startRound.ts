/**
 * Advances a duel session to the next question.
 *
 * Responsibility: pick question, cache it, reset per-round state, emit round_start.
 * Layer: io duel session
 * Depends on: pickQuestionForSession, state map, logger
 * Consumers: playerReady, submitAnswer (via session barrel)
 */

import { logError, logInfo } from "../../utils/logger.js";
import { pickQuestionForSession } from "./questions.js";
import { sessions } from "./state.js";
import type { DuelNamespace, SessionState } from "./types.js";

export async function startRound(io: DuelNamespace, sessionOrId: string | SessionState) {
  try {
    const session = typeof sessionOrId === "string" ? sessions.get(sessionOrId) : sessionOrId;

    if (!session) return;

    session.round += 1;
    session.answered = false;
    session.player1Attempts = 0;
    session.player2Attempts = 0;
    session.roundNonce += 1;

    const question = await pickQuestionForSession(session);

    if (!question) {
      logInfo("[DUEL]", "question:none-available", { sessionId: session.sessionId });
      return;
    }
    session.currentQuestionId = question.id;
    session.currentQuestion = {
      id: question.id,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
    const options = Array.isArray(question.options) ? (question.options as string[]) : [];

    io.to(session.roomId).emit("round_start", {
      round_number: session.round,
      question: {
        id: question.id,
        code_snippet: question.codeSnippet,
        prompt: question.questionText,
        type: question.type,
        options,
      },
      starts_at: Date.now(),
    });
  } catch (error) {
    logError("[DUEL]", error, { phase: "start-round" });
  }
}

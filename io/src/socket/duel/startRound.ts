/**
 * Advances a duel session to the next question and arms the round timer.
 *
 * Responsibility: pick question, emit round_start, attach timeout continuation.
 * Layer: io duel session
 * Depends on: pickQuestionForSession, roundTimeoutFlow, state map, logger
 * Consumers: playerReady, submitAnswer (via session barrel)
 */

import { logError, logInfo } from "../../utils/logger.js";
import { pickQuestionForSession } from "./questions.js";
import { attachRoundTimeout } from "./roundTimeoutFlow.js";
import { sessions } from "./state.js";
import type { DuelNamespace, SessionState } from "./types.js";

export async function startRound(io: DuelNamespace, sessionOrId: string | SessionState) {
  try {
    const session = typeof sessionOrId === "string" ? sessions.get(sessionOrId) : sessionOrId;

    if (!session) return;

    session.round += 1;
    session.answered = false;
    session.roundNonce += 1;
    const nonce = session.roundNonce;

    const question = await pickQuestionForSession(session);

    if (!question) {
      logInfo("[DUEL]", "question:none-available", { sessionId: session.sessionId });
      return;
    }
    session.currentQuestionId = question.id;
    const options = Array.isArray(question.options) ? (question.options as string[]) : [];

    const payload = {
      round_number: session.round,
      question: {
        id: question.id,
        code_snippet: question.codeSnippet,
        prompt: question.questionText,
        type: question.type,
        options,
      },
      starts_at: Date.now(),
    };
    io.to(session.roomId).emit("round_start", payload);
    session.roundTimeout = attachRoundTimeout(io, session, question, nonce, () => startRound(io, session));
  } catch (error) {
    logError("[DUEL]", error, { phase: "start-round" });
  }
}

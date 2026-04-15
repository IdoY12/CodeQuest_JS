/**
 * Registers `submit_answer` so only duel participants can score for their side.
 *
 * Responsibility: validate answer server-side and delegate correct-answer flow.
 * Layer: io duel handlers
 * Depends on: Prisma, applyCorrectDuelAnswer, resolveDuelPlayerSlot
 * Consumers: duel/index.ts
 */

import type { Socket } from "socket.io";
import { prisma } from "@project/db";
import { logError, logInfo } from "../../../utils/logger.js";
import { applyCorrectDuelAnswer } from "../applyCorrectDuelAnswer.js";
import { resolveDuelPlayerSlot } from "../resolveDuelPlayerSlot.js";
import { sessions } from "../state.js";
import type { DuelNamespace } from "../types.js";

export function registerSubmitAnswer(socket: Socket, duel: DuelNamespace) {
  socket.on(
    "submit_answer",
    async (payload: { session_id: string; round_number: number; answer: string; time_taken_ms: number }) => {
      try {
        const session = sessions.get(payload.session_id);

        if (!session) return;

        if (session.answered) return;

        if (!session.currentQuestionId) return;

        const slot = resolveDuelPlayerSlot(session, socket.id);

        if (!slot) {
          logInfo("[DUEL]", "submit_answer:rejected-non-participant", { socketId: socket.id });
          return;
        }

        const question = await prisma.duelQuestion.findUnique({ where: { id: session.currentQuestionId } });

        if (!question) return;

        if (payload.answer !== question.correctAnswer) {
          socket.emit("answer_feedback", { isCorrect: false, lockout_ms: 1000 });
          return;
        }
        applyCorrectDuelAnswer(duel, session, question, slot === "player1", payload.time_taken_ms);
      } catch (error) {
        logError("[DUEL]", error, { phase: "submit_answer" });
      }
    },
  );
}

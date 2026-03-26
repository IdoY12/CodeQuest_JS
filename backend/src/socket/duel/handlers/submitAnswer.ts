import type { Socket } from "socket.io";
import { prisma } from "../../../db/prisma.js";
import { logError } from "../../../utils/logger.js";
import { sessions } from "../state.js";
import { endSession, startRound } from "../session.js";
import type { DuelNamespace } from "../types.js";

export function registerSubmitAnswer(socket: Socket, duel: DuelNamespace) {
  socket.on(
    "submit_answer",
    async (payload: { session_id: string; round_number: number; answer: string; time_taken_ms: number; userId?: string }) => {
      try {
        const session = sessions.get(payload.session_id);
        if (!session) return;
        if (session.answered) return;
        if (!session.currentQuestionId) return;
        const question = await prisma.duelQuestion.findUnique({ where: { id: session.currentQuestionId } });
        if (!question) return;

        const isCorrect = payload.answer === question.correctAnswer;
        if (!isCorrect) {
          socket.emit("answer_feedback", { isCorrect: false, lockout_ms: 1000 });
          return;
        }
        session.answered = true;
        if (session.roundTimeout) {
          clearTimeout(session.roundTimeout);
          session.roundTimeout = null;
        }

        const answeredByPlayer1 = payload.userId === session.player1.userId || socket.id === session.player1.socketId;
        const player1TimeMs = answeredByPlayer1 ? payload.time_taken_ms : 0;
        const player2TimeMs = answeredByPlayer1 ? 0 : payload.time_taken_ms;
        if (answeredByPlayer1) {
          session.score.player1 += 1;
        } else {
          session.score.player2 += 1;
        }
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

        if (session.round >= 5) {
          await endSession(duel, session);
          return;
        }

        setTimeout(() => {
          if (sessions.has(session.sessionId)) {
            void startRound(duel, session);
          }
        }, 1800);
      } catch (error) {
        logError("[DUEL]", error, { phase: "submit_answer" });
      }
    },
  );
}

import { prisma } from "@project/db";
import { logError, logInfo } from "../../utils/logger.js";
import { sessions } from "./state.js";
import { pickQuestionForSession } from "./questions.js";
import { applyXpReward } from "./rewards.js";
export async function startRound(io, sessionOrId) {
    try {
        const session = typeof sessionOrId === "string" ? sessions.get(sessionOrId) : sessionOrId;
        if (!session)
            return;
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
        const options = Array.isArray(question.options) ? question.options : [];
        const payload = {
            round_number: session.round,
            question: {
                id: question.id,
                code_snippet: question.codeSnippet,
                prompt: question.questionText,
                type: question.type,
                options,
                correct_answer: question.correctAnswer,
            },
            starts_at: Date.now(),
        };
        io.to(session.roomId).emit("round_start", payload);
        session.roundTimeout = setTimeout(async () => {
            if (session.roundNonce !== nonce)
                return;
            if (session.answered)
                return;
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
            if (session.round >= 5) {
                await endSession(io, session);
                return;
            }
            if (session.roundNonce === nonce) {
                await startRound(io, session);
            }
        }, 15000);
    }
    catch (error) {
        logError("[DUEL]", error, { phase: "start-round" });
    }
}
export async function endSession(io, session) {
    if (session.roundTimeout) {
        clearTimeout(session.roundTimeout);
        session.roundTimeout = null;
    }
    const winnerIsP1 = session.score.player1 >= session.score.player2;
    const winner = winnerIsP1 ? session.player1 : session.player2;
    const loser = winnerIsP1 ? session.player2 : session.player1;
    io.to(session.player1.socketId).emit("duel_end", {
        winner_user_id: winner.userId,
        final_scores: { player1: session.score.player1, player2: session.score.player2 },
        rating_change: winnerIsP1 ? 50 : -20,
        xp_earned: winnerIsP1 ? 100 : 30,
        round_replay: session.roundReplay,
    });
    io.to(session.player2.socketId).emit("duel_end", {
        winner_user_id: winner.userId,
        final_scores: { player1: session.score.player1, player2: session.score.player2 },
        rating_change: winnerIsP1 ? -20 : 50,
        xp_earned: winnerIsP1 ? 30 : 100,
        round_replay: session.roundReplay,
    });
    await prisma.duelSession
        .create({
        data: {
            player1Id: session.player1.userId,
            player2Id: session.player2.userId,
            winnerId: winner.userId,
            player1Score: session.score.player1,
            player2Score: session.score.player2,
            roundsPlayed: session.round,
            roundReplay: session.roundReplay,
            endedAt: new Date(),
        },
    })
        .catch(() => null);
    sessions.delete(session.sessionId);
    const wr = await prisma.duelRating.findUnique({ where: { userId: winner.userId } });
    if (!wr) {
        await prisma.duelRating.create({ data: { userId: winner.userId, rating: 1050, wins: 1 } }).catch(() => null);
    }
    else {
        await prisma.duelRating
            .update({
            where: { userId: winner.userId },
            data: { rating: { increment: 50 }, wins: { increment: 1 } },
        })
            .catch(() => null);
    }
    const lr = await prisma.duelRating.findUnique({ where: { userId: loser.userId } });
    if (!lr) {
        await prisma.duelRating.create({ data: { userId: loser.userId, rating: 980, losses: 1 } }).catch(() => null);
    }
    else {
        await prisma.duelRating
            .update({
            where: { userId: loser.userId },
            data: { rating: { decrement: 20 }, losses: { increment: 1 } },
        })
            .catch(() => null);
    }
    await applyXpReward(session.player1.userId, winnerIsP1 ? 100 : 30);
    await applyXpReward(session.player2.userId, winnerIsP1 ? 30 : 100);
}

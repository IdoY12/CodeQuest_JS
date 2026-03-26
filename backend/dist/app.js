import config from "config";
import cors from "cors";
import express from "express";
import { authRouter } from "./routers/auth.js";
import { userRouter } from "./routers/user.js";
import { learningRouter } from "./routers/learning.js";
import { duelRouter } from "./routers/duels.js";
import { badgesRouter } from "./routers/badges.js";
import { dailyChallengeRouter } from "./routers/dailyChallenge.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { logError } from "./utils/logger.js";
import { resolveExpressCorsOrigin } from "./utils/runtimeConfig.js";
const app = express();
app.disable("x-powered-by");
if (config.get("app.trustProxy")) {
    app.set("trust proxy", 1);
}
app.use(cors({
    origin: resolveExpressCorsOrigin(),
    credentials: config.get("app.cors.credentials"),
}));
app.use(express.json({ limit: config.get("app.bodyParserJsonLimit") }));
app.use(requestLogger);
app.get("/health", (_req, res) => res.json({ ok: true, service: "codequest-backend" }));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/learning", learningRouter);
app.use("/api/duels", duelRouter);
app.use("/api/badges", badgesRouter);
app.use("/api/daily-challenge", dailyChallengeRouter);
app.use((error, _req, res, _next) => {
    logError("[APP]", error, { phase: "express-handler" });
    return res.status(500).json({ error: "Internal server error" });
});
export { app };

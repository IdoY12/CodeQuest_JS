import config from "config";
import http from "http";
import { Server } from "socket.io";
import { connectDatabase } from "./db/prisma.js";
import { app } from "./app.js";
import { attachDuelNamespace } from "./socket/duel/index.js";
import { validateProductionSecuritySettings } from "./utils/configValidation.js";
import { logError, logInfo } from "./utils/logger.js";
import { resolveSocketIoCors } from "./utils/runtimeConfig.js";

process.on("unhandledRejection", (reason) => {
  logError("[APP]", reason, { type: "unhandledRejection" });
});
process.on("uncaughtException", (error) => {
  logError("[APP]", error, { type: "uncaughtException" });
});

validateProductionSecuritySettings();

await connectDatabase();

const server = http.createServer(app);
const io = new Server(server, {
  cors: resolveSocketIoCors(),
});

attachDuelNamespace(io);

const port = Number(config.get<number | string>("app.port"));
const host = config.get<string>("app.host");
server.listen(port, host, () => {
  logInfo("[APP]", "server-started", {
    port,
    host,
    localUrl: `http://localhost:${port}`,
    lanUrlExample: `http://192.168.1.158:${port}`,
  });
});

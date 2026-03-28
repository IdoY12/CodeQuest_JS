import config from "config";
import http from "http";
import { connectDatabase } from "@project/db";
import { app } from "./app.js";
import { validateProductionSecuritySettings } from "./utils/configValidation.js";
import { logError, logInfo } from "./utils/logger.js";
process.on("unhandledRejection", (reason) => {
    logError("[APP]", reason, { type: "unhandledRejection" });
});
process.on("uncaughtException", (error) => {
    logError("[APP]", error, { type: "uncaughtException" });
});
validateProductionSecuritySettings();
await connectDatabase();
const server = http.createServer(app);
const port = Number(config.get("app.port"));
const host = config.get("app.host");
server.listen(port, host, () => {
    logInfo("[APP]", "server-started", {
        port,
        host,
        localUrl: `http://localhost:${port}`,
        lanUrlExample: `http://192.168.1.158:${port}`,
    });
});

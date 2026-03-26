import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { injectDatabaseUrlFromConfig } from "../db/databaseUrl.js";
injectDatabaseUrlFromConfig();
const backendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const prismaCli = path.join(backendRoot, "node_modules/prisma/build/index.js");
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [prismaCli, ...args], {
    stdio: "inherit",
    cwd: backendRoot,
    env: process.env,
});
process.exit(result.status ?? 1);

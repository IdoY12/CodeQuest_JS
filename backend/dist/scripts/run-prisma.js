import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { injectDatabaseUrlFromConfig } from "@project/db";
// Populate DATABASE_URL from config so Prisma CLI can connect to the correct DB.
injectDatabaseUrlFromConfig();
// Resolve backend root from this file location (src/scripts -> backend root).
const backendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
// Point to the local Prisma CLI entry shipped in node_modules.
const prismaCli = path.join(backendRoot, "node_modules/prisma/build/index.js");
// Forward CLI arguments (e.g. "generate", "migrate", "db seed").
const args = process.argv.slice(2);
// Run Prisma CLI synchronously and stream its output to the current terminal.
const schemaArg = "--schema";
const schemaPath = path.join(backendRoot, "../packages/db/prisma");
const finalArgs = args.includes(schemaArg) ? args : [...args, schemaArg, schemaPath];
const result = spawnSync(process.execPath, [prismaCli, ...finalArgs], {
    stdio: "inherit",
    // Always execute from backend root for consistent Prisma path resolution.
    cwd: backendRoot,
    // Pass along env vars, including injected DATABASE_URL.
    env: process.env,
});
// Exit with the same status code as Prisma CLI (or fail with 1 if unavailable).
process.exit(result.status ?? 1);

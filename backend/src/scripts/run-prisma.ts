import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { injectDatabaseUrlFromConfig } from "@project/db";

// Populate DATABASE_URL from config so Prisma CLI can connect to the correct DB.
injectDatabaseUrlFromConfig();

// Resolve backend root from this file location (src/scripts -> backend root).
const backendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const monorepoRoot = path.join(backendRoot, "..");

// Resolve Prisma CLI under hoisted npm workspaces (root or package-local node_modules).
const requireFromBackend = createRequire(path.join(backendRoot, "package.json"));
let prismaCli: string;

try {
  prismaCli = requireFromBackend.resolve("prisma/build/index.js", {
    paths: [backendRoot, monorepoRoot],
  });
} catch {
  console.error(
    'Could not resolve "prisma/build/index.js". Install the prisma devDependency in the workspace.',
  );
  process.exit(1);
}

// Forward CLI arguments (e.g. "generate", "migrate", "db seed").
const args = process.argv.slice(2);
// Run Prisma CLI synchronously and stream its output to the current terminal.
const schemaArg = "--schema";
const schemaPath = path.join(backendRoot, "../packages/db/prisma");
// `migrate diff` takes explicit --from-* / --to-* paths and rejects global `--schema`.
const isMigrateDiff = args[0] === "migrate" && args[1] === "diff";
const finalArgs =
  args.includes(schemaArg) || isMigrateDiff ? args : [...args, schemaArg, schemaPath];

const result = spawnSync(process.execPath, [prismaCli, ...finalArgs], {
  stdio: "inherit",
  // Always execute from backend root for consistent Prisma path resolution.
  cwd: backendRoot,
  // Pass along env vars, including injected DATABASE_URL.
  env: process.env,
});

// Exit with the same status code as Prisma CLI (or fail with 1 if unavailable).
process.exit(result.status ?? 1);

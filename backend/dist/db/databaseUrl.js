import config from "config";
/** Prisma’s engine reads `DATABASE_URL` from the environment; set it from node-config here only. */
export function injectDatabaseUrlFromConfig() {
    // Read the DB URL from the app config and expose it as DATABASE_URL for Prisma.
    process.env.DATABASE_URL = config.get("database.url");
}

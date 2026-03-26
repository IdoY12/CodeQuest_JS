import config from "config";
/** Prisma’s engine reads `DATABASE_URL` from the environment; set it from node-config here only. */
export function injectDatabaseUrlFromConfig() {
    process.env.DATABASE_URL = config.get("database.url");
}

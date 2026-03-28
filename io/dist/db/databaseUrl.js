import config from "config";
/** Prisma engine reads DATABASE_URL from env; set it from node-config. */
export function injectDatabaseUrlFromConfig() {
    process.env.DATABASE_URL = config.get("database.url");
}

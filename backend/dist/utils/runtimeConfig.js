import config from "config";
/**
 * Express `cors` package: comma-separated origins become an allow-list.
 */
export function resolveExpressCorsOrigin() {
    const raw = config.get("app.cors.origin");
    if (!raw.includes(",")) {
        return raw;
    }
    return raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
}
export function resolveSocketIoCors() {
    const raw = config.get("io.cors.origin");
    const origin = raw.includes(",")
        ? raw
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
        : raw;
    return {
        origin,
        methods: config.get("io.cors.methods"),
    };
}

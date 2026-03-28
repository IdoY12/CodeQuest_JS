import config from "config";
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

const SENSITIVE_KEYS = [
    "password",
    "hashedPassword",
    "token",
    "accessToken",
    "refreshToken",
    "authorization",
];
function redactValue(value) {
    if (Array.isArray(value)) {
        return value.map(redactValue);
    }
    if (value && typeof value === "object") {
        const result = {};
        Object.entries(value).forEach(([key, item]) => {
            const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey.toLowerCase()));
            result[key] = isSensitive ? "***MASKED***" : redactValue(item);
        });
        return result;
    }
    return value;
}
function formatMeta(meta) {
    if (!meta)
        return "";
    try {
        return ` ${JSON.stringify(redactValue(meta))}`;
    }
    catch {
        return " [unserializable-meta]";
    }
}
function write(level, prefix, message, meta) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] ${prefix} ${message}${formatMeta(meta)}`;
    if (level === "ERROR") {
        console.error(line);
        return;
    }
    if (level === "WARN") {
        console.warn(line);
        return;
    }
    console.log(line);
}
export function logInfo(prefix, message, meta) {
    write("INFO", prefix, message, meta);
}
export function logWarn(prefix, message, meta) {
    write("WARN", prefix, message, meta);
}
export function logError(prefix, error, meta) {
    const payload = {
        ...(meta ?? {}),
        error: error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            }
            : { message: String(error) },
    };
    write("ERROR", prefix, "failure", payload);
}
export function sanitizeBody(body) {
    return redactValue(body);
}

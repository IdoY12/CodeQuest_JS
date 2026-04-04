/**
 * Resolves Express `cors` middleware `origin` option from node-config.
 *
 * Responsibility: map `app.cors.origin` to string or string[] allow-list.
 * Layer: @project/server-kit/cors
 * Depends on: parseCommaSeparatedOrigin.ts, config package
 * Consumers: backend app.ts
 */

import config from "config";
import { parseCommaSeparatedOrigin } from "./parseCommaSeparatedOrigin.js";

export function resolveExpressCorsOrigin(): string | string[] {
  const raw = config.get<string>("app.cors.origin");
  return parseCommaSeparatedOrigin(raw);
}

import ivm from "isolated-vm";
import { isDeepStrictEqual } from "node:util";
import type { Prisma } from "@prisma/client";
const CODE_PUZZLE_VM_TIMEOUT_MS = 100;
const ISOLATE_MEMORY_MB = 32;

const PUZZLE_GLOBALS_SCRIPT = `
globalThis.Math = {
  max: function(...args) { return __mathMax.applySync(undefined, args, { arguments: { copy: true }, result: { copy: true } }); },
  min: function(...args) { return __mathMin.applySync(undefined, args, { arguments: { copy: true }, result: { copy: true } }); }
};
globalThis.Object = {
  keys: function(o) { return __objectKeys.applySync(undefined, [o], { arguments: { copy: true }, result: { copy: true } }); }
};
`;

type CaseRow = { inputContext: Record<string, unknown>; expectedOutput: unknown };
const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_MEMORY_MB });
const puzzleGlobalsScript = isolate.compileScriptSync(PUZZLE_GLOBALS_SCRIPT);

export function codePuzzleAllTestCasesPass(answer: string, raw: Prisma.JsonValue | null): boolean {
  const cases = parseCases(raw);
  if (!cases) return false;
  const preparedAnswer = answer.trim().replace(/;$/, "");
  for (const row of cases) {
    try {
      if (!isDeepStrictEqual(runExpression(preparedAnswer, row.inputContext), row.expectedOutput)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function parseCases(raw: Prisma.JsonValue | null): CaseRow[] | null {
  if (raw === null || !Array.isArray(raw) || raw.length === 0) return null;
  const out: CaseRow[] = [];
  for (const element of raw) {
    if (element === null || typeof element !== "object" || Array.isArray(element)) return null;
    const caseRecord = element as Record<string, unknown>;
    const inputContext = caseRecord.inputContext;
    if (inputContext === null || typeof inputContext !== "object" || Array.isArray(inputContext)) return null;
    if (!Object.prototype.hasOwnProperty.call(caseRecord, "expectedOutput")) return null;
    out.push({ inputContext: inputContext as Record<string, unknown>, expectedOutput: caseRecord.expectedOutput });
  }
  return out;
}

function installPuzzleContext(inputContext: Record<string, unknown>): ivm.Context {
  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync("global", jail.derefInto());
  jail.setSync("__mathMax", new ivm.Reference(Math.max));
  jail.setSync("__mathMin", new ivm.Reference(Math.min));
  jail.setSync("__objectKeys", new ivm.Reference(Object.keys));
  puzzleGlobalsScript.runSync(context, { timeout: CODE_PUZZLE_VM_TIMEOUT_MS });
  for (const [key, value] of Object.entries(inputContext)) {
    jail.setSync(key, new ivm.ExternalCopy(value).copyInto());
  }
  return context;
}

function runExpression(preparedAnswer: string, inputContext: Record<string, unknown>): unknown {
  const copy = structuredClone(inputContext) as Record<string, unknown>;
  const context = installPuzzleContext(copy);
  try {
    const script = isolate.compileScriptSync(`(()=>{"use strict";return (${preparedAnswer});})()`);
    const evaluatedValue = script.runSync(context, { timeout: CODE_PUZZLE_VM_TIMEOUT_MS, copy: true });
    if (evaluatedValue && typeof evaluatedValue === "object" && typeof (evaluatedValue as Promise<unknown>).then === "function") {
      throw new Error("async");
    }
    return evaluatedValue === undefined ? null : evaluatedValue;
  } finally {
    context.release();
  }
}

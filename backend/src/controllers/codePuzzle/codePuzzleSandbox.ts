import vm from "node:vm";
import { isDeepStrictEqual } from "node:util";
import type { Prisma } from "@prisma/client";

export const CODE_PUZZLE_VM_TIMEOUT_MS = 100;

type CaseRow = { inputContext: Record<string, unknown>; expectedOutput: unknown };

export function codePuzzleAllTestCasesPass(answer: string, raw: Prisma.JsonValue | null): boolean {
  const cases = parseCases(raw);
  if (!cases) return false;
  const preparedAnswer = prepExpr(answer);
  for (const row of cases) {
    try {
      if (!isDeepStrictEqual(runExpression(preparedAnswer, row.inputContext), row.expectedOutput)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function prepExpr(answer: string): string {
  return answer.trim().replace(/;$/, "");
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
    out.push({
      inputContext: inputContext as Record<string, unknown>,
      expectedOutput: caseRecord.expectedOutput,
    });
  }
  return out;
}

function runExpression(preparedAnswer: string, inputContext: Record<string, unknown>): unknown {
  const copy = structuredClone(inputContext) as Record<string, unknown>;
  const code = `'use strict';\nreturn (${preparedAnswer});\n`;
  const sandbox = Object.assign(Object.create(null), copy);
  const evaluatedValue = vm.runInNewContext(code, sandbox as object, { timeout: CODE_PUZZLE_VM_TIMEOUT_MS });
  if (evaluatedValue instanceof Promise) throw new Error("async");
  return evaluatedValue === undefined ? null : evaluatedValue;
}

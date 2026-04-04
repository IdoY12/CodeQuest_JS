/**
 * Tuple specs for intermediate personalized MCQ exercises (30 items).
 *
 * Responsibility: static content for one personalization band.
 * Layer: @project/personalized-exercises
 * Depends on: buildMcqFromSpec.ts (ExerciseSpec type)
 * Consumers: exercisePools.ts
 */

import type { ExerciseSpec } from "./buildMcqFromSpec.js";

export const intermediateSpecs: ExerciseSpec[] = [
  ["im-1", "What does map produce here?", "const prices = [3, 5];\nconsole.log(prices.map((p) => p * 10));", "[30,50]", ["[3,5]", "[30,50]", "80", "undefined"], "map transforms each element and returns a new array."],
  ["im-2", "What does filter return?", "const ids = [2, 7, 8, 11];\nconsole.log(ids.filter((id) => id > 7));", "[8,11]", ["[2,7]", "[8,11]", "11", "undefined"], "filter keeps values that satisfy the predicate."],
  ["im-3", "What does find return?", "const users = [{id:1},{id:4}];\nconsole.log(users.find((u) => u.id === 4));", "{id:4}", ["{id:1}", "{id:4}", "[{id:4}]", "undefined"], "find returns the first matching element."],
  ["im-4", "What does some return?", "const nums = [1, 3, 8];\nconsole.log(nums.some((n) => n % 2 === 0));", "true", ["false", "true", "8", "undefined"], "At least one item is even."],
  ["im-5", "What does every return?", "const nums = [2, 4, 6];\nconsole.log(nums.every((n) => n % 2 === 0));", "true", ["true", "false", "6", "undefined"], "All elements pass the condition."],
  ["im-6", "What is reduce result?", "const points = [2, 3, 5];\nconsole.log(points.reduce((a, b) => a + b, 0));", "10", ["235", "10", "8", "undefined"], "reduce accumulates to one value."],
  ["im-7", "What logs from this closure?", "function maker(){ let v=0; return () => ++v; }\nconst next = maker();\nconsole.log(next(), next());", "1 2", ["1 1", "1 2", "2 2", "0 1"], "Returned function keeps lexical state."],
  ["im-8", "What prints with var in async loop?", "for (var i=0;i<2;i++){ setTimeout(()=>console.log(i),0); }", "2 2", ["0 1", "2 2", "1 2", "undefined"], "var shares one binding, final value is printed."],
  ["im-9", "What prints with let in async loop?", "for (let i=0;i<2;i++){ setTimeout(()=>console.log(i),0); }", "0 1", ["2 2", "0 1", "1 1", "undefined"], "let creates per-iteration bindings."],
  ["im-10", "What is callback role here?", "const out = [1,2,3].map((n) => n + 1);", "Function passed into map", ["Array to map", "Function passed into map", "Promise object", "Loop index"], "map expects a callback for each element."],
  ["im-11", "What is .then chained value?", "Promise.resolve(2).then((v) => v * 3).then(console.log);", "6", ["2", "3", "6", "undefined"], "First then returns 6 to next then."],
  ["im-12", "What does catch handle?", "Promise.reject(new Error('x')).catch(() => 'ok').then(console.log);", "ok", ["x", "ok", "undefined", "throws"], "catch recovers rejected promise."],
  ["im-13", "What does await resolve to?", "async function run(){ const v = await Promise.resolve(9); return v; }\nrun().then(console.log);", "9", ["Promise", "9", "undefined", "0"], "await unwraps resolved value."],
  ["im-14", "What is printed by try/catch?", "try { throw new Error('nope'); } catch { console.log('handled'); }", "handled", ["nope", "handled", "undefined", "error"], "catch executes after throw."],
  ["im-15", "What does prototype access do?", "const animal = {sound:'mew'};\nconst cat = Object.create(animal);\nconsole.log(cat.sound);", "mew", ["undefined", "mew", "animal", "null"], "Property is read from prototype chain."],
  ["im-16", "What does class method return?", "class Counter { value=2; up(){ return this.value + 1; } }\nconsole.log(new Counter().up());", "3", ["2", "3", "1", "undefined"], "Method reads instance field and increments."],
  ["im-17", "Import/export concept: what does import read?", "// module exports const api = 5;\n// consumer imports api", "Exported binding from another module", ["Local variable only", "Exported binding from another module", "A class instance", "A promise by default"], "import consumes named/default exports."],
  ["im-18", "Optional chaining result?", "const cfg = {};\nconsole.log(cfg.server?.port ?? 3000);", "3000", ["undefined", "3000", "null", "0"], "Missing path yields undefined then fallback."],
  ["im-19", "Object.keys output?", "const stats = { wins: 2, losses: 1 };\nconsole.log(Object.keys(stats));", "['wins','losses']", ["[2,1]", "['wins','losses']", "wins,losses", "undefined"], "keys returns property-name array."],
  ["im-20", "Object.values output?", "const stats = { wins: 2, losses: 1 };\nconsole.log(Object.values(stats));", "[2,1]", ["['wins','losses']", "[2,1]", "2", "undefined"], "values returns property values."],
  ["im-21", "Object.entries shape?", "const m = { a: 1 };\nconsole.log(Object.entries(m));", "[['a',1]]", ["['a',1]", "[['a',1]]", "{a:1}", "undefined"], "entries returns key-value tuple arrays."],
  ["im-22", "Chained array methods result?", "const out = [1,2,3,4].filter((n)=>n%2===0).map((n)=>n*3);\nconsole.log(out);", "[6,12]", ["[2,4]", "[6,12]", "18", "undefined"], "filter then map transforms remaining elements."],
  ["im-23", "What does this IIFE print?", "(() => { const hidden = 7; console.log(hidden); })();", "7", ["hidden", "7", "undefined", "error"], "IIFE executes immediately in its own scope."],
  ["im-24", "What does reduce with object accumulator build?", "const rows = ['a','b'];\nconsole.log(rows.reduce((acc, v) => ({...acc, [v]: true}), {}));", "{a:true,b:true}", ["['a','b']", "{a:true,b:true}", "true", "undefined"], "Reducer returns updated object each step."],
  ["im-25", "Promise chain order concept?", "console.log('A'); Promise.resolve().then(()=>console.log('B')); console.log('C');", "A C B", ["A B C", "A C B", "B A C", "C A B"], "Microtask runs after sync lines."],
  ["im-26", "What does this callback parameter represent?", "[10,20].forEach((value, index) => console.log(index));", "Current item index", ["Array length", "Current item index", "Promise state", "Loop exit code"], "forEach passes value and index."],
  ["im-27", "What prints?", "const factory = (start) => () => start + 1;\nconst fn = factory(4);\nconsole.log(fn());", "5", ["4", "5", "start", "undefined"], "Closure captures start as 4."],
  ["im-28", "What is output of find on miss?", "const value = [1,2,3].find((x) => x > 5);\nconsole.log(value);", "undefined", ["null", "undefined", "[]", "0"], "find returns undefined when no match."],
  ["im-29", "What does async function always return?", "async function x(){ return 1; }\nconsole.log(x() instanceof Promise);", "true", ["false", "true", "1", "undefined"], "async wraps return in Promise."],
  ["im-30", "What does try/catch/finally guarantee?", "try { throw new Error('x'); } catch {} finally { console.log('done'); }", "finally block runs", ["catch skipped", "finally block runs", "promise rejected", "done is optional"], "finally runs regardless of throw/catch path."],
];


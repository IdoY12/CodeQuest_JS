/**
 * Tuple specs for advanced personalized MCQ exercises (30 items).
 *
 * Responsibility: static content for one personalization band.
 * Layer: @project/personalized-exercises
 * Depends on: buildMcqFromSpec.ts (ExerciseSpec type)
 * Consumers: exercisePools.ts
 */

import type { ExerciseSpec } from "./buildMcqFromSpec.js";

export const advancedSpecs: ExerciseSpec[] = [
  ["ad-1", "Memoization closure result?", "function memo(){ const cache = new Map(); return (n)=> cache.get(n) ?? (cache.set(n,n*n), cache.get(n)); }\nconst sq = memo(); console.log(sq(3));", "9", ["3", "6", "9", "undefined"], "Factory keeps cache across calls via closure."],
  ["ad-2", "What does bind change?", "const obj = { x: 4 };\nfunction read(){ return this.x; }\nconst bound = read.bind(obj);\nconsole.log(bound());", "4", ["undefined", "4", "obj", "NaN"], "bind fixes this to obj."],
  ["ad-3", "What does call do here?", "function sum(a,b){ return a+b+this.base; }\nconsole.log(sum.call({base:1},2,3));", "6", ["5", "6", "undefined", "NaN"], "call sets this and passes args immediately."],
  ["ad-4", "What does apply expect?", "function max2(a,b){ return Math.max(a,b); }\nconsole.log(max2.apply(null,[7,2]));", "7", ["2", "7", "[7,2]", "undefined"], "apply passes arguments as array-like."],
  ["ad-5", "Prototype chain lookup result?", "const a = { p: 1 }; const b = Object.create(a); const c = Object.create(b);\nconsole.log(c.p);", "1", ["undefined", "1", "0", "c"], "Lookup walks up prototype chain."],
  ["ad-6", "Generator first next value?", "function* ids(){ yield 10; yield 20; }\nconst g = ids();\nconsole.log(g.next().value);", "10", ["20", "10", "undefined", "done"], "First next pulls first yield value."],
  ["ad-7", "Iterator protocol requires what?", "const it = [1,2][Symbol.iterator]();", "next() returning {value,done}", ["value only", "next() returning {value,done}", "promise resolve", "generator only"], "Iterators expose next with value/done."],
  ["ad-8", "Why use Symbol keys?", "const id = Symbol('id'); const obj = { [id]: 5 };", "Avoid accidental key collisions", ["Faster loops only", "Avoid accidental key collisions", "Serialize to JSON always", "Replace Map"], "Symbols create unique property keys."],
  ["ad-9", "WeakMap key constraint?", "const wm = new WeakMap();", "Keys must be objects", ["Keys must be strings", "Keys must be objects", "Any primitive", "Only arrays"], "WeakMap accepts object keys only."],
  ["ad-10", "WeakSet stores what?", "const ws = new WeakSet();", "Object references", ["Numbers", "Strings", "Object references", "Tuples"], "WeakSet holds objects weakly referenced."],
  ["ad-11", "Proxy get trap can do what?", "new Proxy({}, { get(target, prop){ return 'x'; } });", "Intercept property reads", ["Only writes", "Intercept property reads", "Patch event loop", "Compile code"], "get trap runs when reading props."],
  ["ad-12", "Reflect.get role?", "Reflect.get({a:1}, 'a')", "Standardized property access helper", ["Array clone", "Standardized property access helper", "Promise utility", "JSON parser"], "Reflect mirrors low-level object operations."],
  ["ad-13", "Microtask vs macrotask order?", "setTimeout(()=>console.log('timeout'),0); Promise.resolve().then(()=>console.log('then')); console.log('sync');", "sync then timeout", ["then sync timeout", "sync then timeout", "timeout then sync", "random"], "sync first, then microtask, then macrotask."],
  ["ad-14", "Promise.all result behavior?", "Promise.all([Promise.resolve(1), Promise.resolve(2)])", "Resolves array when all succeed", ["First value only", "Resolves array when all succeed", "Always rejects", "Runs sequentially"], "all waits for every promise."],
  ["ad-15", "Promise.race behavior?", "Promise.race([slow, fast])", "Settles with first settled promise", ["Waits all", "Settles with first settled promise", "Sorts by value", "Rejects by default"], "race mirrors earliest settle."],
  ["ad-16", "Promise.allSettled result shape?", "Promise.allSettled([Promise.resolve(1), Promise.reject('x')])", "Array of {status,value|reason}", ["Single boolean", "Array of {status,value|reason}", "Only fulfilled values", "Error throw"], "allSettled keeps both outcomes."],
  ["ad-17", "Advanced async pattern: what does await in loop imply?", "for (const id of ids) { await fetchById(id); }", "Sequential requests", ["Parallel by default", "Sequential requests", "Compile error", "No network"], "await inside loop serializes execution."],
  ["ad-18", "How to run async tasks in parallel?", "await Promise.all(tasks.map((t)=>t()));", "Launch all tasks then await all", ["Runs one by one", "Launch all tasks then await all", "Ignores errors", "Returns first only"], "Promise.all parallelizes pending tasks."],
  ["ad-19", "Currying output?", "const add = (a) => (b) => a + b;\nconsole.log(add(2)(5));", "7", ["25", "7", "undefined", "NaN"], "Curried function returns another function."],
  ["ad-20", "Partial application result?", "const multiply = (a,b) => a*b; const double = multiply.bind(null,2);\nconsole.log(double(6));", "12", ["8", "12", "26", "undefined"], "bind pre-fills first argument."],
  ["ad-21", "Functional composition result?", "const compose = (f,g) => (x) => f(g(x));\nconst inc = (x)=>x+1; const dbl=(x)=>x*2; console.log(compose(inc,dbl)(3));", "7", ["6", "7", "8", "undefined"], "dbl(3)=6 then inc -> 7."],
  ["ad-22", "Deep clone safe for plain data?", "const clone = structuredClone(data);", "Clones nested plain structures", ["Only shallow copy", "Clones nested plain structures", "Mutates original", "Stringifies functions"], "structuredClone copies deep serializable data."],
  ["ad-23", "Regex test output?", "console.log(/^\\d+$/.test('1234'));", "true", ["false", "true", "1234", "undefined"], "Pattern matches one or more digits only."],
  ["ad-24", "Regex mismatch output?", "console.log(/^[a-z]+$/.test('abc7'));", "false", ["true", "false", "abc7", "undefined"], "abc7 has digit so pattern fails."],
  ["ad-25", "Module pattern purpose?", "const service = (()=>{ const secret=1; return { read:()=>secret }; })();", "Encapsulate private state", ["Global mutation", "Encapsulate private state", "Compile to class", "Disable closures"], "IIFE module hides internal variables."],
  ["ad-26", "Observer pattern core idea?", "source.subscribe(listener)", "Publishers notify subscribed listeners", ["Single callback only", "Publishers notify subscribed listeners", "Promise batching", "Inheritance helper"], "Observer connects producer and consumers."],
  ["ad-27", "Singleton intent?", "class Config { static instance = new Config(); }", "Keep a single shared instance", ["Create many copies", "Keep a single shared instance", "Replace DI", "Avoid exports"], "Singleton exposes one global-like instance."],
  ["ad-28", "Tagged template receives what?", "tag`Hi ${name}`", "Strings array plus interpolated values", ["Only final string", "Strings array plus interpolated values", "Object keys", "Promise"], "Tag functions receive chunks and expressions."],
  ["ad-29", "This edge case output?", "const x = { value: 2, f(){ return () => this.value; } };\nconsole.log(x.f()());", "2", ["undefined", "2", "x", "NaN"], "Arrow keeps outer method this context."],
  ["ad-30", "Which is safer fallback for nullable nested access?", "const port = cfg?.server?.port ?? 8080;", "Optional chaining with nullish fallback", ["cfg.server.port || 8080 always", "Optional chaining with nullish fallback", "delete cfg.server", "throw cfg"], "?. and ?? avoid crashes while preserving 0/empty string semantics."],
];

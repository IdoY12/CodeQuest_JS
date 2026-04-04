/**
 * Tuple specs for basics personalized MCQ exercises (30 items).
 *
 * Responsibility: static content for one personalization band.
 * Layer: @project/personalized-exercises
 * Depends on: buildMcqFromSpec.ts (ExerciseSpec type)
 * Consumers: exercisePools.ts
 */

import type { ExerciseSpec } from "./buildMcqFromSpec.js";

export const basicsSpecs: ExerciseSpec[] = [
  ["bs-1", "Which line is a function expression?", "/* pick one */", "const log = function() {}", ["function run() {}", "const log = function() {}", "return () => {}", "log()"], "Function expression is assigned to a variable."],
  ["bs-2", "What does this arrow function return?", "const add = (a, b) => a + b;\nconsole.log(add(2, 4));", "6", ["24", "6", "undefined", "NaN"], "Arrow expression returns a+b."],
  ["bs-3", "What is printed?", "const n = 'Maya';\nconsole.log(`Hi ${n}`);", "Hi Maya", ["Hi ${n}", "Hi Maya", "Maya Hi", "undefined"], "Template literal interpolates variable value."],
  ["bs-4", "What does ternary produce?", "const ready = true;\nconst msg = ready ? 'Go' : 'Wait';\nconsole.log(msg);", "Go", ["Wait", "Go", "true", "undefined"], "True condition selects first value."],
  ["bs-5", "What does indexOf return?", "const tags = ['js', 'ui', 'api'];\nconsole.log(tags.indexOf('ui'));", "1", ["0", "1", "2", "-1"], "ui is at index 1."],
  ["bs-6", "What is joined string?", "const p = ['a', 'b', 'c'];\nconsole.log(p.join('-'));", "a-b-c", ["abc", "a,b,c", "a-b-c", "undefined"], "join with '-' inserts dashes."],
  ["bs-7", "What prints?", "const q = [1,2,3];\nconsole.log(q.slice(1));", "[2,3]", ["[1,2]", "[2,3]", "[3]", "2"], "slice(1) copies from index 1 onward."],
  ["bs-8", "What value does this log?", "const r = [1,2,3];\nconsole.log([...r].reverse()[0]);", "3", ["1", "2", "3", "undefined"], "Copied array reversed starts with 3."],
  ["bs-9", "What does this print?", "const user = {name:'Ari', say(){ return this.name; }};\nconsole.log(user.say());", "Ari", ["name", "Ari", "undefined", "say"], "this refers to user inside method call."],
  ["bs-10", "Which destructuring is correct?", "const obj = {id: 7, title: 'task'};\n/* pick id extraction */", "const { id } = obj", ["const id = obj.id", "const { id } = obj", "const [id] = obj", "obj.id()"], "Object destructuring uses braces."],
  ["bs-11", "What does default parameter do here?", "const greet = (name = 'friend') => `Hi ${name}`;\nconsole.log(greet());", "Hi friend", ["Hi ", "Hi friend", "friend", "undefined"], "Default value is used when arg missing."],
  ["bs-12", "What does spread create?", "const base = [1,2];\nconst next = [...base, 3];\nconsole.log(next);", "[1,2,3]", ["[1,2]", "[1,2,3]", "3", "undefined"], "Spread copies base and appends 3."],
  ["bs-13", "Which loop iterates array values?", "const names=['a','b'];\n/* pick loop */", "for (const n of names)", ["for (const i in names)", "for (const n of names)", "for (names)", "while names"], "for...of iterates values."],
  ["bs-14", "Which loop iterates object keys?", "const score={a:1,b:2};\n/* pick loop */", "for (const k in score)", ["for (const k of score)", "for (const k in score)", "for (score)", "forEach(score)"], "for...in iterates enumerable keys."],
  ["bs-15", "What does short-circuit return?", "const title = '' || 'Untitled';\nconsole.log(title);", "Untitled", ["", "Untitled", "false", "undefined"], "|| returns first truthy value."],
  ["bs-16", "What does nullish coalescing return?", "const c = null ?? 'fallback';\nconsole.log(c);", "fallback", ["null", "fallback", "undefined", "false"], "?? uses right side for null/undefined only."],
  ["bs-17", "What is logged?", "const score = 0 || 15;\nconsole.log(score);", "15", ["0", "15", "false", "undefined"], "0 is falsy so || picks 15."],
  ["bs-18", "What is logged?", "const score = 0 ?? 15;\nconsole.log(score);", "0", ["0", "15", "false", "undefined"], "0 is not nullish, so ?? keeps 0."],
  ["bs-19", "What is printed?", "const x = ['a','b','c'];\nconsole.log(x.slice(0,2).join(','));", "a,b", ["a,b", "b,c", "abc", "undefined"], "slice(0,2) gives a,b then join."],
  ["bs-20", "What is output?", "const fn = (v) => v ? 'yes' : 'no';\nconsole.log(fn(false));", "no", ["yes", "no", "false", "undefined"], "False condition returns no."],
  ["bs-21", "What does this log?", "const person = { first:'Ira', last:'N' };\nconst { first } = person;\nconsole.log(first);", "Ira", ["Ira", "person", "first", "undefined"], "first is extracted from person."],
  ["bs-22", "What does this print?", "const pair = [8, 9];\nconst [a, b] = pair;\nconsole.log(b);", "9", ["8", "9", "pair", "undefined"], "Array destructuring assigns by position."],
  ["bs-23", "What is result?", "const total = (a = 1, b = 2) => a + b;\nconsole.log(total(5));", "7", ["5", "6", "7", "undefined"], "a=5, b default 2, sum 7."],
  ["bs-24", "Which is immutable reverse?", "const list=[1,2,3];\n/* pick one */", "[...list].reverse()", ["list.reverse()", "[...list].reverse()", "list.slice(1)", "list.unshift()"], "Copy+reverse keeps original list unchanged."],
  ["bs-25", "What does this return?", "const isReady = true && 'launch';\nconsole.log(isReady);", "launch", ["true", "launch", "false", "undefined"], "&& returns last operand when all truthy."],
  ["bs-26", "What is output?", "const mode = '' ?? 'dark';\nconsole.log(mode);", "", ["dark", "", "undefined", "false"], "Empty string is not nullish, so stays."],
  ["bs-27", "What prints?", "const teams = ['red', 'blue'];\nconsole.log(teams.indexOf('green'));", "-1", ["0", "1", "-1", "undefined"], "indexOf returns -1 for missing element."],
  ["bs-28", "What prints?", "const x = ['n','o'];\nconsole.log(x.join(''));", "no", ["n,o", "no", "on", "undefined"], "join with empty separator concatenates."],
  ["bs-29", "What is output?", "const obj = { a: 1, b: 2 };\nlet sum = 0;\nfor (const k in obj) sum += obj[k];\nconsole.log(sum);", "3", ["2", "3", "12", "undefined"], "Loop adds both values."],
  ["bs-30", "What does this print?", "const out = [1,2,3].slice(1).reverse();\nconsole.log(out);", "[3,2]", ["[2,3]", "[3,2]", "[1,2,3]", "undefined"], "slice copy then reverse gives [3,2]."],
];


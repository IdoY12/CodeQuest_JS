/**
 * Tuple specs for beginner personalized MCQ exercises (30 items).
 *
 * Responsibility: static content for one personalization band.
 * Layer: @project/personalized-exercises
 * Depends on: buildMcqFromSpec.ts (ExerciseSpec type)
 * Consumers: exercisePools.ts
 */

import type { ExerciseSpec } from "./buildMcqFromSpec.js";

export const beginnerSpecs: ExerciseSpec[] = [
  ["bg-1", "Which declaration is best for a score that changes during a game?", "/* choose one */", "let", ["const", "let", "var", "score"], "let is intended for values that may be reassigned."],
  ["bg-2", "What does this print?", "const type = typeof 12;\nconsole.log(type);", "number", ["string", "number", "boolean", "undefined"], "typeof 12 returns number."],
  ["bg-3", "What is the output?", "console.log(7 + 5);", "12", ["75", "12", "2", "undefined"], "Basic arithmetic addition results in 12."],
  ["bg-4", "What is printed?", "const label = '  code  ';\nconsole.log(label.trim());", "code", ["  code  ", "code", "CODE", "false"], "trim removes spaces at both ends."],
  ["bg-5", "Which branch runs?", "const lives = 0;\nif (lives) { console.log('play'); } else { console.log('game over'); }", "game over", ["play", "game over", "0", "undefined"], "0 is falsy, so else runs."],
  ["bg-6", "How many loop iterations happen?", "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}", "3", ["2", "3", "4", "1"], "i takes 0,1,2 so loop runs 3 times."],
  ["bg-7", "What does this return?", "const fruits = ['apple', 'pear'];\nconsole.log(fruits[0]);", "apple", ["pear", "apple", "2", "undefined"], "Index 0 points at the first element."],
  ["bg-8", "What prints?", "const user = { name: 'Mina' };\nconsole.log(user.name);", "Mina", ["name", "Mina", "undefined", "object"], "Dot access reads the property value."],
  ["bg-9", "What does this function output?", "function shout() { console.log('Hey!'); }\nshout();", "Hey!", ["shout", "Hey!", "undefined", "function"], "Function logs the string when called."],
  ["bg-10", "What is the result?", "console.log('5' + 1);", "51", ["6", "51", "NaN", "undefined"], "String plus number concatenates into a string."],
  ["bg-11", "What does includes return here?", "const title = 'CodeQuest';\nconsole.log(title.includes('Quest'));", "true", ["false", "true", "Quest", "undefined"], "Quest is a substring of CodeQuest."],
  ["bg-12", "What is printed?", "const msg = 'hi';\nconsole.log(msg.toUpperCase());", "HI", ["hi", "HI", "Hi", "undefined"], "toUpperCase converts letters to uppercase."],
  ["bg-13", "What is printed?", "const cities = ['Rome'];\ncities.push('Lima');\nconsole.log(cities.length);", "2", ["1", "2", "3", "undefined"], "push adds one element, length becomes 2."],
  ["bg-14", "What does pop return?", "const list = ['a', 'b'];\nconsole.log(list.pop());", "b", ["a", "b", "2", "undefined"], "pop removes and returns the last item."],
  ["bg-15", "Which value is truthy?", "/* pick truthy */", "'0'", ["0", "''", "'0'", "null"], "Non-empty strings are truthy, including '0'."],
  ["bg-16", "What prints?", "let total = 1;\nwhile (total < 4) { total++; }\nconsole.log(total);", "4", ["3", "4", "5", "1"], "Loop increments until total equals 4."],
  ["bg-17", "What does typeof null return?", "console.log(typeof null);", "object", ["null", "object", "undefined", "number"], "JavaScript historically reports object for null."],
  ["bg-18", "What does this print?", "const name = '  Ada';\nconsole.log(name.toLowerCase().trim());", "ada", ["Ada", "  ada", "ada", "undefined"], "toLowerCase then trim results in ada."],
  ["bg-19", "What is logged?", "const x = 10;\nif (x > 5) console.log('big');", "big", ["small", "big", "true", "10"], "10 is greater than 5."],
  ["bg-20", "What prints?", "const arr = [3, 9, 1];\nconsole.log(arr.length);", "3", ["2", "3", "9", "undefined"], "Array has three items."],
  ["bg-21", "What does this output?", "const pet = { kind: 'cat' };\nconsole.log(pet['kind']);", "cat", ["kind", "cat", "undefined", "object"], "Bracket notation reads the same property."],
  ["bg-22", "What is the output?", "console.log(14 - 6);", "8", ["20", "8", "146", "undefined"], "Subtraction yields 8."],
  ["bg-23", "What happens when condition is false?", "if (false) { console.log('A'); } else { console.log('B'); }", "B", ["A", "B", "false", "undefined"], "Else branch executes."],
  ["bg-24", "What does this print?", "const word = 'play';\nconsole.log(word.includes('ay'));", "true", ["true", "false", "ay", "undefined"], "ay appears in play."],
  ["bg-25", "What is printed?", "let temp = 2;\ntemp = temp + 3;\nconsole.log(temp);", "5", ["23", "5", "2", "undefined"], "Value is reassigned to 5."],
  ["bg-26", "What prints?", "function tap() { console.log('tap'); }\ntap();", "tap", ["tap", "undefined", "function", "null"], "Function body logs tap."],
  ["bg-27", "What does this return?", "const str = 'JS';\nconsole.log(str.toLowerCase());", "js", ["JS", "js", "Js", "undefined"], "toLowerCase converts to js."],
  ["bg-28", "What prints?", "const nums = [2];\nnums.push(4);\nconsole.log(nums[1]);", "4", ["2", "4", "1", "undefined"], "New value is stored at index 1."],
  ["bg-29", "What is printed?", "const price = 0;\nconsole.log(Boolean(price));", "false", ["true", "false", "0", "undefined"], "0 coerces to false."],
  ["bg-30", "What prints?", "const t = '  wow  ';\nconsole.log(t.trim().length);", "3", ["2", "3", "7", "undefined"], "After trim, wow has length 3."],
];


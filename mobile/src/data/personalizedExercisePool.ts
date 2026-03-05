export type PersonalizationLevel = "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED";

export interface PersonalizedExercise {
  id: string;
  type: "CONCEPT_CARD" | "MULTIPLE_CHOICE" | "FIND_THE_BUG" | "DRAG_DROP" | "CODE_FILL" | "TAP_TOKEN";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
}

function options(values: string[], correct: string) {
  return values.map((text, index) => ({ id: `${text}-${index}`, text, isCorrect: text === correct }));
}

function makeMultipleChoice(
  id: string,
  prompt: string,
  codeSnippet: string,
  correctAnswer: string,
  choiceValues: string[],
  explanation: string,
): PersonalizedExercise {
  return {
    id,
    type: "MULTIPLE_CHOICE",
    prompt,
    codeSnippet,
    correctAnswer,
    explanation,
    xpReward: 20,
    options: options(choiceValues, correctAnswer),
  };
}

function cloneExercise(exercise: PersonalizedExercise, index: number): PersonalizedExercise {
  return {
    ...exercise,
    id: `${exercise.id}-${index}`,
    options: exercise.options.map((item, optionIndex) => ({ ...item, id: `${exercise.id}-${index}-${optionIndex}` })),
  };
}

const beginnerTemplates: PersonalizedExercise[] = [
  makeMultipleChoice("cb-1", "What does this print?", "const name = 'CodeQuest';\nconsole.log(name);", "CodeQuest", ["name", "CodeQuest", "undefined", "null"], "console.log prints the value stored in the variable."),
  makeMultipleChoice("cb-2", "Which keyword should you use for a value that should not be reassigned?", "// pick one", "const", ["let", "const", "var", "value"], "Use const when a binding should stay fixed."),
  makeMultipleChoice("cb-3", "What does this expression evaluate to?", "console.log(2 + 3 * 2);", "8", ["10", "8", "7", "6"], "Multiplication happens before addition."),
  makeMultipleChoice("cb-4", "What prints here?", "const age = 16;\nif (age >= 18) {\n  console.log('Adult');\n} else {\n  console.log('Minor');\n}", "Minor", ["Adult", "Minor", "undefined", "16"], "The condition is false, so the else branch runs."),
  makeMultipleChoice("cb-5", "What is the return value?", "function greet() {\n  return 'Hello';\n}\nconsole.log(greet());", "Hello", ["greet", "Hello", "undefined", "function"], "Functions return values back to the caller."),
];

const basicsTemplates: PersonalizedExercise[] = [
  makeMultipleChoice("kb-1", "What does map return?", "const doubled = [1, 2, 3].map((n) => n * 2);\nconsole.log(doubled);", "[2,4,6]", ["[1,2,3]", "[2,4,6]", "6", "undefined"], "map creates a new array with transformed values."),
  makeMultipleChoice("kb-2", "What is logged?", "const user = { name: 'Ari', score: 12 };\nconsole.log(user.score);", "12", ["Ari", "score", "12", "undefined"], "Object properties are accessed with dot notation."),
  makeMultipleChoice("kb-3", "Which array method keeps only matching items?", "const active = users.____((u) => u.active);", "filter", ["map", "reduce", "filter", "forEach"], "filter returns a subset of elements."),
  makeMultipleChoice("kb-4", "What does this catch block do?", "try {\n  JSON.parse('{bad');\n} catch (error) {\n  console.log('Handled');\n}", "Handled", ["Handled", "Crash app", "undefined", "false"], "try/catch handles runtime exceptions safely."),
  makeMultipleChoice("kb-5", "What is returned?", "function total(a, b, c) {\n  return a + b + c;\n}\nconsole.log(total(2, 3, 4));", "9", ["234", "7", "9", "undefined"], "Parameters can be combined and returned as one result."),
];

const intermediateTemplates: PersonalizedExercise[] = [
  makeMultipleChoice("im-1", "What logs first?", "setTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise'));\nconsole.log('sync');", "sync", ["timeout", "promise", "sync", "none"], "Synchronous code runs before queued callbacks."),
  makeMultipleChoice("im-2", "What does async return?", "async function getValue() {\n  return 42;\n}\nconsole.log(getValue());", "A Promise", ["42", "A Promise", "undefined", "Error"], "async always returns a Promise."),
  makeMultipleChoice("im-3", "What does this print?", "const profile = { stats: { streak: 6 } };\nconsole.log(profile?.stats?.streak ?? 0);", "6", ["0", "undefined", "6", "null"], "Optional chaining safely accesses nested values."),
  makeMultipleChoice("im-4", "What is a closure?", "function makeAdder(x) {\n  return (y) => x + y;\n}", "A function that remembers outer variables", ["A loop", "A type", "A function that remembers outer variables", "A class"], "Closures keep lexical scope even after outer execution ends."),
  makeMultipleChoice("im-5", "What does fetch usually return?", "const response = await fetch('/api/data');", "A Response object Promise", ["A number", "A Response object Promise", "Only JSON", "A DOM node"], "fetch resolves to a Response object that you can parse."),
];

const advancedTemplates: PersonalizedExercise[] = [
  makeMultipleChoice("ad-1", "What should an Express POST /users route return on success?", "app.post('/users', async (req, res) => {\n  // create user\n});", "201 with created resource", ["200 plain text", "201 with created resource", "500 always", "No response"], "POST create routes should return 201 and created data."),
  makeMultipleChoice("ad-2", "What helps prevent race conditions in async flows?", "await Promise.all(tasks);", "Explicit coordination and cancellation", ["Ignoring errors", "Explicit coordination and cancellation", "Blocking the UI thread", "Random delays"], "Concurrency requires deterministic coordination strategies."),
  makeMultipleChoice("ad-3", "Which pattern fits event subscriptions?", "source.subscribe(listener);", "Observer", ["Factory", "Singleton", "Observer", "Decorator"], "Observer models publishers and subscribers."),
  makeMultipleChoice("ad-4", "What is a useful first step for performance debugging?", "// profile app behavior", "Measure before optimizing", ["Rewrite everything", "Measure before optimizing", "Disable logs only", "Minify first"], "Profiling identifies real bottlenecks before changes."),
  makeMultipleChoice("ad-5", "What is a common Jest unit-test structure?", "describe('sum', () => {\n  it('adds numbers', () => expect(sum(1, 2)).toBe(3));\n});", "Arrange, Act, Assert", ["Compile, Run, Deploy", "Arrange, Act, Assert", "Build, Ship, Ignore", "Mock, Sleep, Retry"], "AAA keeps tests easy to read and maintain."),
];

function buildThirty(level: PersonalizationLevel): PersonalizedExercise[] {
  const templates =
    level === "BEGINNER"
      ? beginnerTemplates
      : level === "BASICS"
        ? basicsTemplates
        : level === "INTERMEDIATE"
          ? intermediateTemplates
          : advancedTemplates;

  const exercises: PersonalizedExercise[] = [];
  for (let i = 0; i < 30; i += 1) {
    exercises.push(cloneExercise(templates[i % templates.length], i + 1));
  }
  return exercises;
}

export function getExercisePoolForLevel(level: PersonalizationLevel): PersonalizedExercise[] {
  return buildThirty(level);
}

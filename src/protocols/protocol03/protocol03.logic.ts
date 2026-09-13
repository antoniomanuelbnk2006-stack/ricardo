import type { P3Test } from "./protocol03.data";

export function isCorrectAnswer(test: P3Test, opt: string): boolean {
  return opt === test.answer;
}

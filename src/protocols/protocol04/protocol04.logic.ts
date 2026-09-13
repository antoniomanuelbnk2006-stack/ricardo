import type { P4Test } from "./protocol04.data";

export function isCorrectAnswer(test: P4Test, opt: string): boolean {
  return opt === test.answer;
}

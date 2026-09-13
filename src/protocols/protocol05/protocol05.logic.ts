import type { P5RecallQuestion } from "./protocol05.data";

export function isCorrectAnswer(q: P5RecallQuestion, opt: string): boolean {
  return opt === q.answer;
}

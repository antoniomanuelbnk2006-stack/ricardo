import type { ReactionPhase, Stimulus } from "./protocol02.data";

// Determina si pulsar (o no pulsar) era la accion correcta para un
// estimulo concreto, segun la fase activa.
export function shouldPress(phaseId: ReactionPhase["id"], s: Stimulus): boolean {
  switch (phaseId) {
    case "p1":
      return s.word === "GO";
    case "p2":
      return s.word === "STOP";
    case "p3":
      return !!s.color && s.word.toLowerCase() !== s.color;
    case "p4":
      return !!s.color && s.word.toLowerCase() === s.color;
    case "p5":
      return s.word === "GO";
    default:
      return false;
  }
}

export function isStimulusCorrect(phaseId: ReactionPhase["id"], s: Stimulus, pressed: boolean): boolean {
  return shouldPress(phaseId, s) === pressed;
}

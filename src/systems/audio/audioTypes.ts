export type OscillatorKind = "sine" | "square" | "triangle" | "sawtooth";

export interface BeepDefinition {
  freq: number;
  dur: number;
  type: OscillatorKind;
  gain: number;
  sweepTo?: number;
}

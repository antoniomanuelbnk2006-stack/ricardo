import type { ProtocolId } from "../../types/game";
import type { CorruptionLevel } from "./corruptionTypes";

// 0 -> Desktop, 1 -> Protocol 01-02, 2 -> Protocol 03, 3 -> Protocol 04, 4 -> Protocol 05/00
export const CORRUPTION_THRESHOLDS: { level: CorruptionLevel; requires: ProtocolId }[] = [
  { level: 1, requires: "01" },
  { level: 2, requires: "03" },
  { level: 3, requires: "04" },
  { level: 4, requires: "05" },
];

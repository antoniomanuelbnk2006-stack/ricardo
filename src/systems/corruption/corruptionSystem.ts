import type { ProtocolId } from "../../types/game";
import type { CorruptionLevel } from "./corruptionTypes";
import { CORRUPTION_THRESHOLDS } from "./corruptionLevels";

export function deriveCorruptionLevel(completedProtocols: ProtocolId[]): CorruptionLevel {
  let level: CorruptionLevel = 0;
  for (const t of CORRUPTION_THRESHOLDS) {
    if (completedProtocols.includes(t.requires)) level = t.level;
  }
  return level;
}

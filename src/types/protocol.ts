import type { ProtocolId } from "./game";

export interface ProtocolDefinition {
  id: ProtocolId;
  codeName: string; // ej. "PATTERN"
  displayName: string; // ej. "PROTOCOL 03 — PATTERN"
}

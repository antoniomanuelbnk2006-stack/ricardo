export type WindowKind = "ricky" | "files" | "trash" | "config";

export interface OpenWindow {
  id: WindowKind;
  kind: WindowKind;
  x: number;
  y: number;
  minimized: boolean;
  maximized: boolean;
  prevPosition: { x: number; y: number } | null; // para restaurar tras maximizar
}

import { create } from "zustand";
import type { OpenWindow, WindowKind } from "../types/window";

const DEFAULT_POSITIONS: Record<WindowKind, { x: number; y: number }> = {
  ricky: { x: 100, y: 40 },
  files: { x: 260, y: 120 },
  trash: { x: 340, y: 180 },
  config: { x: 400, y: 220 },
};

interface WindowStore {
  open: OpenWindow[];
  focused: WindowKind | null;
  openWindow: (kind: WindowKind) => void;
  closeWindow: (kind: WindowKind) => void;
  focusWindow: (kind: WindowKind) => void;
  moveWindow: (kind: WindowKind, x: number, y: number) => void;
  minimizeWindow: (kind: WindowKind) => void;
  toggleMinimize: (kind: WindowKind) => void;
  toggleMaximize: (kind: WindowKind) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  open: [],
  focused: null,

  openWindow: (kind) => {
    if (get().open.some((w) => w.kind === kind)) {
      set((s) => ({
        open: s.open.map((w) => (w.kind === kind ? { ...w, minimized: false } : w)),
        focused: kind,
      }));
      return;
    }
    const pos = DEFAULT_POSITIONS[kind];
    set((s) => ({
      open: [
        ...s.open,
        { id: kind, kind, x: pos.x, y: pos.y, minimized: false, maximized: false, prevPosition: null },
      ],
      focused: kind,
    }));
  },

  closeWindow: (kind) =>
    set((s) => ({
      open: s.open.filter((w) => w.kind !== kind),
      focused: s.focused === kind ? null : s.focused,
    })),

  focusWindow: (kind) => set({ focused: kind }),

  moveWindow: (kind, x, y) =>
    set((s) => ({ open: s.open.map((w) => (w.kind === kind ? { ...w, x, y } : w)) })),

  minimizeWindow: (kind) =>
    set((s) => ({
      open: s.open.map((w) => (w.kind === kind ? { ...w, minimized: true } : w)),
      focused: s.focused === kind ? null : s.focused,
    })),

  // Click en el boton de la taskbar: si esta minimizada la restaura, si
  // esta activa la minimiza (comportamiento clasico de Windows 95/98).
  toggleMinimize: (kind) =>
    set((s) => {
      const win = s.open.find((w) => w.kind === kind);
      if (!win) return s;
      if (win.minimized) {
        return {
          open: s.open.map((w) => (w.kind === kind ? { ...w, minimized: false } : w)),
          focused: kind,
        };
      }
      if (s.focused === kind) {
        return {
          open: s.open.map((w) => (w.kind === kind ? { ...w, minimized: true } : w)),
          focused: null,
        };
      }
      return { focused: kind };
    }),

  toggleMaximize: (kind) =>
    set((s) => ({
      open: s.open.map((w) => {
        if (w.kind !== kind) return w;
        if (w.maximized) {
          const back = w.prevPosition ?? { x: w.x, y: w.y };
          return { ...w, maximized: false, x: back.x, y: back.y, prevPosition: null };
        }
        return { ...w, maximized: true, prevPosition: { x: w.x, y: w.y } };
      }),
      focused: kind,
    })),
}));

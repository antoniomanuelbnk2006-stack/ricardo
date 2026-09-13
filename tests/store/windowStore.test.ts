import { describe, it, expect, beforeEach } from "vitest";
import { useWindowStore } from "../../src/store/windowStore";

describe("windowStore", () => {
  beforeEach(() => {
    useWindowStore.setState({ open: [], focused: null });
  });

  it("abre una ventana y la deja enfocada", () => {
    useWindowStore.getState().openWindow("files");
    const state = useWindowStore.getState();
    expect(state.open).toHaveLength(1);
    expect(state.focused).toBe("files");
  });

  it("toggleMinimize minimiza la ventana activa y la restaura al volver a pulsar", () => {
    const store = useWindowStore.getState();
    store.openWindow("files");
    store.toggleMinimize("files");
    expect(useWindowStore.getState().open[0].minimized).toBe(true);
    expect(useWindowStore.getState().focused).toBeNull();

    useWindowStore.getState().toggleMinimize("files");
    expect(useWindowStore.getState().open[0].minimized).toBe(false);
    expect(useWindowStore.getState().focused).toBe("files");
  });

  it("toggleMaximize maximiza y restaura la posicion original", () => {
    const store = useWindowStore.getState();
    store.openWindow("files");
    const original = useWindowStore.getState().open[0];
    store.toggleMaximize("files");
    expect(useWindowStore.getState().open[0].maximized).toBe(true);

    useWindowStore.getState().toggleMaximize("files");
    const restored = useWindowStore.getState().open[0];
    expect(restored.maximized).toBe(false);
    expect(restored.x).toBe(original.x);
    expect(restored.y).toBe(original.y);
  });
});

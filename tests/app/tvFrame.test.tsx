import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { useWindowStore } from "../../src/store/windowStore";
import { initialGameState } from "../../src/systems/game/gameState";
import { CANVAS_W, CANVAS_H, TV_FRAME_W, TV_FRAME_H } from "../../src/app/constants";

// El televisor es decoracion: rodea al escritorio pero no lo escala, no lo
// recorta y no intercepta eventos. Estos tests fijan justo eso, porque un
// marco que se comiera un clic o desplazara las coordenadas seria peor que
// no tenerlo.

/** jsdom no implementa PointerEvent; MouseEvent si lleva clientX/clientY. */
function pointer(type: string, x: number, y: number): MouseEvent {
  return new MouseEvent(type, { clientX: x, clientY: y, button: 0, bubbles: true });
}

function setFrame(enabled: boolean) {
  useGameStore.setState({
    ...initialGameState,
    hydrated: true,
    settings: { ...initialGameState.settings, tvFrameEnabled: enabled },
  });
}

describe("marco de televisor", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useWindowStore.setState({ open: [], focused: null });
  });

  it("se dibuja cuando esta activado", () => {
    setFrame(true);
    const { container } = render(<App />);
    expect(container.querySelector(".tv-shell")).not.toBeNull();
    expect(container.querySelector(".app-canvas-framed")).not.toBeNull();
  });

  it("no se dibuja cuando esta desactivado", () => {
    setFrame(false);
    const { container } = render(<App />);
    expect(container.querySelector(".tv-shell")).toBeNull();
    expect(container.querySelector(".app-canvas")).not.toBeNull();
  });

  it("el hueco de la pantalla sigue midiendo 1024x768 exactos", () => {
    setFrame(true);
    const { container } = render(<App />);
    const canvas = container.querySelector<HTMLElement>(".app-canvas-framed")!;
    expect(canvas.style.width).toBe(`${CANVAS_W}px`);
    expect(canvas.style.height).toBe(`${CANVAS_H}px`);

    // El mueble solo anade borde alrededor; nunca encoge la pantalla.
    expect(TV_FRAME_W).toBeGreaterThan(CANVAS_W);
    expect(TV_FRAME_H).toBeGreaterThan(CANVAS_H);
  });

  it("el escritorio no lleva ninguna transformacion propia dentro del marco", () => {
    // Si el lienzo se escalara por su cuenta, las coordenadas del puntero
    // dejarian de cuadrar con lo que se ve y el arrastre se descolocaria.
    setFrame(true);
    const { container } = render(<App />);
    const canvas = container.querySelector<HTMLElement>(".app-canvas-framed")!;
    expect(canvas.style.transform).toBe("");
  });

  it("el reflejo del cristal no intercepta clics", () => {
    setFrame(true);
    const { container } = render(<App />);
    const glass = container.querySelector<HTMLElement>(".tv-glass")!;
    expect(glass).not.toBeNull();
    expect(glass.getAttribute("aria-hidden")).toBe("true");
  });

  it("se pueden abrir, mover y cerrar ventanas con el marco puesto", () => {
    setFrame(true);
    render(<App />);

    fireEvent.dblClick(screen.getByText("Config"));
    const win = screen.getByRole("region", { name: "Config" });
    expect(win).toBeInTheDocument();

    const before = useWindowStore.getState().open.find((w) => w.kind === "config")!;
    const titleBar = win.firstElementChild as HTMLElement;
    fireEvent(titleBar, pointer("pointerdown", 200, 200));
    fireEvent(window, pointer("pointermove", 260, 240));
    fireEvent(window, pointer("pointerup", 260, 240));

    const after = useWindowStore.getState().open.find((w) => w.kind === "config")!;
    expect(Number.isFinite(after.x)).toBe(true);
    expect(Number.isFinite(after.y)).toBe(true);
    expect(after.x).toBeGreaterThan(before.x);
    expect(after.y).toBeGreaterThan(before.y);

    fireEvent.click(within(win).getByRole("button", { name: "Cerrar Config" }));
    expect(screen.queryByRole("region", { name: "Config" })).not.toBeInTheDocument();
  });

  it("el interruptor de Config enciende y apaga el mueble", () => {
    setFrame(true);
    const { container } = render(<App />);
    fireEvent.dblClick(screen.getByText("Config"));

    const toggle = screen.getByRole("checkbox", { name: /TV CABINET/ });
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);
    expect(useGameStore.getState().settings.tvFrameEnabled).toBe(false);
    expect(container.querySelector(".tv-shell")).toBeNull();

    fireEvent.click(screen.getByRole("checkbox", { name: /TV CABINET/ }));
    expect(container.querySelector(".tv-shell")).not.toBeNull();
  });

  it("la preferencia sobrevive a una recarga", () => {
    setFrame(true);
    render(<App />);
    fireEvent.dblClick(screen.getByText("Config"));
    fireEvent.click(screen.getByRole("checkbox", { name: /TV CABINET/ }));

    useGameStore.setState({ ...initialGameState });
    useGameStore.getState().hydrate();
    expect(useGameStore.getState().settings.tvFrameEnabled).toBe(false);
  });
});

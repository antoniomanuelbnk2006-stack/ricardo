import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, act, screen, fireEvent, within } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { useWindowStore } from "../../src/store/windowStore";
import { initialGameState } from "../../src/systems/game/gameState";
import { SECRET_DEFINITIONS } from "../../src/systems/secrets/secretDefinitions";

function openAchievements() {
  render(<App />);
  fireEvent.dblClick(screen.getByText("Mis archivos"));
  fireEvent.click(screen.getByText("achievements.log"));
}

describe("achievements.log", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState({ ...initialGameState, hydrated: true });
    // windowStore es estado de modulo: sin esto, las ventanas abiertas en
    // un test siguen abiertas en el siguiente y "Mis archivos" aparece dos
    // veces (icono + boton de la barra de tareas).
    useWindowStore.setState({ open: [], focused: null });
  });

  it("marca con tick solo los logros conseguidos", () => {
    useGameStore.setState({ ...initialGameState, hydrated: true, secretsFound: ["s2"] });
    openAchievements();

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(SECRET_DEFINITIONS.length);

    const unlockedRow = rows[1]; // s2 es el segundo de la lista
    expect(unlockedRow.textContent).toContain("[\u2713]");
    expect(unlockedRow.textContent).toContain("Conseguido");

    const lockedRow = rows[0];
    expect(lockedRow.textContent).toContain("[ ]");
    expect(lockedRow.textContent).toContain("Pendiente");
  });

  it("no revela el nombre ni la descripcion de un logro que falta, solo su pista", () => {
    openAchievements();

    for (const secret of SECRET_DEFINITIONS) {
      expect(screen.queryByText(secret.name)).not.toBeInTheDocument();
      expect(screen.queryByText(secret.description)).not.toBeInTheDocument();
      expect(screen.getByText(secret.hint)).toBeInTheDocument();
    }
    expect(screen.getAllByText(/REGISTRO \d\d/)).toHaveLength(SECRET_DEFINITIONS.length);
  });

  it("la pista se sustituye por la descripcion al conseguir el logro", () => {
    openAchievements();
    const s1 = SECRET_DEFINITIONS.find((s) => s.id === "s1")!;
    expect(screen.getByText(s1.hint)).toBeInTheDocument();

    act(() => {
      useGameStore.getState().unlockSecret("s1");
    });

    const row = within(screen.getAllByRole("listitem")[0]);
    expect(row.getByText(s1.description)).toBeInTheDocument();
    expect(screen.queryByText(s1.hint)).not.toBeInTheDocument();
  });

  it("ninguna pista contiene el codigo de PROTOCOL 00", () => {
    // Una pista orienta, no resuelve: si alguna dejase escrito el 0437,
    // el archivo de logros se convertiria en una guia.
    for (const secret of SECRET_DEFINITIONS) {
      expect(secret.hint).not.toContain("0437");
    }
  });

  it("revela nombre y descripcion en cuanto se consigue", () => {
    openAchievements();

    act(() => {
      useGameStore.getState().unlockSecret("s3");
    });

    // Se consulta dentro de la fila: el nombre tambien sale en el aviso
    // emergente de secreto, y una busqueda global encontraria los dos.
    const s3 = SECRET_DEFINITIONS.find((s) => s.id === "s3")!;
    const row = within(screen.getAllByRole("listitem")[2]);
    expect(row.getByText(s3.name)).toBeInTheDocument();
    expect(row.getByText(s3.description)).toBeInTheDocument();
  });

  it("el tick aparece en vivo, con la ventana ya abierta", () => {
    openAchievements();
    expect(screen.getAllByRole("listitem")[0].textContent).toContain("[ ]");

    act(() => {
      useGameStore.getState().unlockSecret("s1");
    });

    expect(screen.getAllByRole("listitem")[0].textContent).toContain("[\u2713]");
  });

  it("resalta el logro recien conseguido y deja de resaltarlo despues", () => {
    vi.useFakeTimers();
    openAchievements();

    act(() => {
      useGameStore.getState().unlockSecret("s1");
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(screen.getAllByRole("listitem")[0].className).toContain("is-new");

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getAllByRole("listitem")[0].className).not.toContain("is-new");
    vi.useRealTimers();
  });

  it("el contador del archivo coincide con el progreso real", () => {
    useGameStore.setState({
      ...initialGameState,
      hydrated: true,
      secretsFound: ["s4", "s1", "s5"],
    });
    render(<App />);
    fireEvent.dblClick(screen.getByText("Mis archivos"));

    // Marca en la lista de archivos, antes de abrirlo.
    expect(screen.getByText("3/5")).toBeInTheDocument();

    fireEvent.click(screen.getByText("achievements.log"));
    expect(screen.getByText("3/5")).toBeInTheDocument();
    expect(screen.getByText("2 registro(s) sin escribir.")).toBeInTheDocument();
  });

  it("anuncia el registro completo con los cinco logros", () => {
    useGameStore.setState({
      ...initialGameState,
      hydrated: true,
      secretsFound: ["s1", "s2", "s3", "s4", "s5"],
    });
    openAchievements();
    expect(screen.getByText("REGISTRO COMPLETO.")).toBeInTheDocument();
  });
});

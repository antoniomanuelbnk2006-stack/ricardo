import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App";

describe("App", () => {
  it("monta sin errores y muestra el escritorio con sus iconos", () => {
    render(<App />);
    expect(screen.getByText("RICKYEDIT.EXE")).toBeInTheDocument();
    expect(screen.getByText("Mis archivos")).toBeInTheDocument();
    expect(screen.getByText("Papelera")).toBeInTheDocument();
    expect(screen.getByText("Config")).toBeInTheDocument();
    expect(screen.getByText("START")).toBeInTheDocument();
  });

  it("abre la ventana RICKYEDIT.EXE al hacer doble click en su icono", async () => {
    render(<App />);
    const icon = screen.getByText("RICKYEDIT.EXE");
    icon.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(await screen.findByText("C:\\RICKYEDIT")).toBeInTheDocument();
  });
});

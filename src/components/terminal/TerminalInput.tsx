// Prompt cosmetico tras el boot. El comando secreto "0437" se detecta de
// forma global (systems/input/keyboardManager.ts) para que funcione desde
// cualquier pantalla, no solo con este prompt enfocado.
export function TerminalInput() {
  return (
    <div>
      C:\RICKYEDIT&gt; <span style={{ animation: "cursor-blink 1s step-end infinite" }}>&#9608;</span>
    </div>
  );
}

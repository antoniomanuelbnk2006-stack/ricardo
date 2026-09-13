export interface TypingEngineOptions {
  lines: string[];
  charDelayMs?: number;
  lineDelayMs?: number;
  onChar?: (char: string) => void;
  onLineComplete?: (line: string, index: number) => void;
  onDone?: () => void;
}

// Motor de tipeo caracter a caracter, independiente de React, para que
// Terminal.tsx/ProtocolIntro.tsx solo tengan que orquestar estado y no
// logica de temporizado. Soporta "skipLine()": click o tecla completa
// la linea actual al instante (biblia, seccion TERMINAL — SKIP), sin
// saltarse toda la escena de golpe.
export class TypingEngine {
  private lines: string[];
  private charDelayMs: number;
  private lineDelayMs: number;
  private onChar?: (char: string) => void;
  private onLineComplete?: (line: string, index: number) => void;
  private onDone?: () => void;
  private cancelled = false;
  private lineIndex = 0;
  private charIndex = 0;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private onPartialLine: ((partial: string) => void) | null = null;

  constructor(opts: TypingEngineOptions) {
    this.lines = opts.lines;
    this.charDelayMs = opts.charDelayMs ?? 42;
    this.lineDelayMs = opts.lineDelayMs ?? 120;
    this.onChar = opts.onChar;
    this.onLineComplete = opts.onLineComplete;
    this.onDone = opts.onDone;
  }

  start(onPartialLine: (partial: string) => void): void {
    this.onPartialLine = onPartialLine;
    this.step();
  }

  private step = (): void => {
    if (this.cancelled) return;
    if (this.lineIndex >= this.lines.length) {
      this.onDone?.();
      return;
    }
    const full = this.lines[this.lineIndex];
    if (this.charIndex >= full.length) {
      this.onLineComplete?.(full, this.lineIndex);
      this.lineIndex += 1;
      this.charIndex = 0;
      this.onPartialLine?.("");
      this.timeoutId = setTimeout(this.step, this.lineDelayMs);
      return;
    }
    const partial = full.slice(0, this.charIndex + 1);
    this.onPartialLine?.(partial);
    const ch = full[this.charIndex];
    if (ch !== " ") this.onChar?.(ch);
    this.charIndex += 1;
    this.timeoutId = setTimeout(this.step, this.charDelayMs);
  };

  // Completa la linea que se esta tipeando ahora mismo y deja que el
  // resto de la secuencia siga a su ritmo normal.
  skipLine(): void {
    if (this.cancelled || this.lineIndex >= this.lines.length) return;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    const full = this.lines[this.lineIndex];
    if (this.charIndex < full.length) {
      this.onPartialLine?.(full);
      this.charIndex = full.length;
    }
    this.timeoutId = setTimeout(this.step, 0);
  }

  cancel(): void {
    this.cancelled = true;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

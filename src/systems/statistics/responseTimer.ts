// Pequena utilidad para medir tiempos de respuesta reales sin imponer
// nunca un maximo: el tiempo es una estadistica, no una condicion de fallo.
export class ResponseTimer {
  private startedAt: number;

  constructor() {
    this.startedAt = Date.now();
  }

  reset(): void {
    this.startedAt = Date.now();
  }

  elapsedMs(): number {
    return Date.now() - this.startedAt;
  }
}

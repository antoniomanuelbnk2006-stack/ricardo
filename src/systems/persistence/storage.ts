// Envoltorio simple sobre localStorage. Aqui SI es un proyecto real
// (no un artifact de Claude.ai), asi que localStorage funciona de verdad.
export function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento no disponible (modo privado, cuota, etc.) -> se ignora
  }
}

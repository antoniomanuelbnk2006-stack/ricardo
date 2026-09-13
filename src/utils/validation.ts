export function isDigit(key: string): boolean {
  return /^[0-9]$/.test(key);
}

export function bufferEndsWith(buffer: string, code: string): boolean {
  return buffer.endsWith(code);
}

export const PLAYER_NAME_MAX = 16;

export type NameValidation = { ok: true; value: string } | { ok: false; error: string };

// Validacion del nombre del jugador (biblia, seccion 5). Se normaliza
// antes de juzgar: espacios de sobra colapsados y recorte en los bordes,
// para que "  ricky  " no se tome por un nombre distinto de "ricky".
// Se permiten letras (con acentos), numeros, espacio, guion, guion bajo y
// punto: lo justo para un nick sin abrir la puerta a inyectar marcado.
export function validatePlayerName(raw: string): NameValidation {
  const value = raw.trim().replace(/\s+/g, " ");
  if (value.length === 0) return { ok: false, error: "IDENTIFICACION REQUERIDA." };
  if (value.length > PLAYER_NAME_MAX) {
    return { ok: false, error: `MAXIMO ${PLAYER_NAME_MAX} CARACTERES.` };
  }
  if (!/^[\p{L}\p{N} ._-]+$/u.test(value)) {
    return { ok: false, error: "CARACTERES NO RECONOCIDOS POR EL SISTEMA." };
  }
  return { ok: true, value };
}

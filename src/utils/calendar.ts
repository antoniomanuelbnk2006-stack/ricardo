const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const WEEKDAYS_LONG = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function formatLongDate(date: Date): string {
  return `${WEEKDAYS_LONG[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export interface CalendarDay {
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}

// Genera la cuadricula del mes (semanas empezando en lunes) para el
// mini-calendario que aparece al hacer click en el reloj de la taskbar.
export function buildMonthGrid(date: Date): { weekdays: string[]; weeks: CalendarDay[][] } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarDay[] = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: 0, isToday: false, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isToday: d === today, isCurrentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, isToday: false, isCurrentMonth: false });
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return { weekdays: WEEKDAYS, weeks };
}

export function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

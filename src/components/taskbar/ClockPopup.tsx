import { TASKBAR_H } from "../../app/constants";
import { buildMonthGrid, formatLongDate, formatMonthYear } from "../../utils/calendar";

interface ClockPopupProps {
  date: Date;
}

// Ventanita clasica de "fecha y hora" que aparece al hacer click sobre
// el reloj de la taskbar: fecha completa + mini calendario del mes con
// el dia de hoy resaltado.
export function ClockPopup({ date }: ClockPopupProps) {
  const { weekdays, weeks } = buildMonthGrid(date);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        right: 2,
        bottom: TASKBAR_H,
        width: 190,
        background: "var(--win-bg)",
        border: "2px outset #ffffff",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
        zIndex: 10000,
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        color: "#000",
        padding: 8,
      }}
    >
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}>{formatMonthYear(date)}</div>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        {hh}:{mm}:{ss}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w} style={{ fontWeight: "normal", opacity: 0.6, padding: "1px 0" }}>
                {w[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((cell, di) => (
                <td
                  key={di}
                  style={{
                    padding: "1px 0",
                    background: cell.isToday ? "var(--titlebar-active-a)" : "transparent",
                    color: cell.isToday ? "#fff" : cell.isCurrentMonth ? "#000" : "#aaa",
                  }}
                >
                  {cell.day || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ borderTop: "1px solid #808080", marginTop: 6, paddingTop: 4, textAlign: "center" }}>
        {formatLongDate(date)}
      </div>
    </div>
  );
}

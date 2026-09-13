import type { ReactNode } from "react";

interface FilePropertiesProps {
  children: ReactNode;
  onBack: () => void;
}

export function FileProperties({ children, onBack }: FilePropertiesProps) {
  return (
    <div>
      {children}
      <button className="files-back-btn" onClick={onBack}>
        Volver
      </button>
    </div>
  );
}

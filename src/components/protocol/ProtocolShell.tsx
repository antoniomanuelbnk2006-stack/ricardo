import type { ReactNode } from "react";
import { ProtocolHeader } from "./ProtocolHeader";
import { ProtocolFooter } from "./ProtocolFooter";

interface ProtocolShellProps {
  name: string;
  secretsFound: number;
  flash: boolean;
  children: ReactNode;
}

export function ProtocolShell({ name, secretsFound, flash, children }: ProtocolShellProps) {
  return (
    <div className="protocol-shell">
      <ProtocolHeader name={name} />
      <div className="protocol-body">{children}</div>
      <ProtocolFooter found={secretsFound} flash={flash} />
    </div>
  );
}

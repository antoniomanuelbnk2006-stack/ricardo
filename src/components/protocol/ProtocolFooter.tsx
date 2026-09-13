import { SecretCounter } from "./SecretCounter";

interface ProtocolFooterProps {
  found: number;
  flash: boolean;
}

export function ProtocolFooter({ found, flash }: ProtocolFooterProps) {
  return <SecretCounter found={found} flash={flash} />;
}

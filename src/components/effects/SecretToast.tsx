import { useSecretDiscovery } from "../../systems/secrets/useSecretDiscovery";
import { TOTAL_SECRETS } from "../../systems/secrets/secretDefinitions";

const HOLD_MS = 2600;

// Aviso breve al descubrir un secreto. Muestra el NOMBRE del secreto y el
// progreso real; antes mostraba el numero del identificador ("s3" -> 03),
// asi que encontrar DON'T LOOK AWAY como segundo secreto anunciaba
// "03/05" y contradecia al contador de la esquina, que decia 2/5.
export function SecretToast() {
  const { name, count } = useSecretDiscovery(HOLD_MS);
  if (!name) return null;

  return (
    <div className="secret-toast" role="status">
      <div className="secret-toast-title">SECRET FOUND</div>
      <div className="secret-toast-name">{name}</div>
      <div className="secret-toast-count">
        {count}/{TOTAL_SECRETS} SECRETOS ENCONTRADOS
      </div>
    </div>
  );
}

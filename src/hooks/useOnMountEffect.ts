import { useEffect } from "react";

/**
 * Runs an effect once on mount. Wraps useEffect with empty deps
 * to communicate intent clearly and avoid lint noise.
 */
export function useOnMountEffect(effect: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}

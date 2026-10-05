import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while rendering on the server and during hydration, true afterwards
// — lets a component that portals into document.body render nothing until
// the browser is ready, without a hydration mismatch and without setting
// state from inside an effect.
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

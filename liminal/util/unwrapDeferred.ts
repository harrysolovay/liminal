import type { DeferredOr } from "./DeferredOr.js"

export function unwrapDeferred<T>(deferred: DeferredOr<T>): T {
  return typeof deferred === "function" ? (deferred as () => T)() : deferred
}

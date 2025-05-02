import { Rune, RuneKey } from "../Rune.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

/**
 * Emits an event to be supplied to handlers.
 * Used for broadcasting state changes and triggering side effects.
 */
export function* emit<E>(event: EnsureNarrow<E>): Generator<Rune<E>, void> {
  return yield {
    [RuneKey]: true,
    instruction: {
      kind: "emit",
      event,
    },
  }
}

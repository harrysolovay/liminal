import { Rune, RuneKey } from "../Rune.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

export function* emit<E>(event: EnsureNarrow<E>): Generator<Rune<E>, void> {
  return yield {
    [RuneKey]: true,
    value: {
      kind: "event",
      event,
    },
  }
}

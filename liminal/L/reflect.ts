import type { LEvent } from "../LEvent.ts"
import { Rune, RuneKey } from "../Rune.ts"
import type { Strand } from "../Strand.ts"

/** Returns the current strand instance, providing access to context and parent information. */
export const reflect: Iterable<Rune<LEvent>, Strand> = {
  *[Symbol.iterator]() {
    return yield {
      [RuneKey]: true,
      value: { kind: "reflect" },
    }
  },
}

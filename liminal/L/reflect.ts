import type { LEvent } from "../LEvent.ts"
import { Rune, RuneKey } from "../Rune.ts"
import type { Strand } from "../Strand.ts"

export const reflect: Iterable<Rune<LEvent>, Strand> = {
  *[Symbol.iterator]() {
    return yield {
      [RuneKey]: true,
      value: { kind: "reflect" },
    }
  },
}

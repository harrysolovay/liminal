import type { LEvent } from "../LEvent.ts"
import { Rune, RuneKey } from "../Rune.ts"
import type { Strand } from "../Strand.ts"

export const current: Iterable<Rune<LEvent>, Strand> = {
  *[Symbol.iterator]() {
    return yield {
      [RuneKey]: true,
      descriptor: { kind: "self" },
    }
  },
}

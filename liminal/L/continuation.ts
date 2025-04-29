import type { LEvent } from "../LEvent.ts"
import { Rune, RuneKey } from "../Rune.ts"

export function* continuation<R>(debug: string, f: () => R): Generator<Rune<LEvent>, Awaited<R>> {
  return yield {
    [RuneKey]: true,
    descriptor: {
      kind: "continuation",
      debug,
      f,
    },
  }
}

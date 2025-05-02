import type { LEvent } from "../LEvent.ts"
import { Rune, RuneKey } from "../Rune.ts"

/** Yields a continuation rune that executes a function and passes its result to the next iteration. */
export function* continuation<R>(debug: string, f: () => R): Generator<Rune<LEvent>, Awaited<R>> {
  return yield {
    [RuneKey]: true,
    value: {
      kind: "continuation",
      debug,
      f,
    },
  }
}

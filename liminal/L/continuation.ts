import { type ContinuationRune, type Rune, RuneKey } from "../Rune.ts"

export function* continuation<R>(
  f: () => R,
  debug: string,
): Generator<Rune<never>, Awaited<R>> {
  return yield {
    [RuneKey]: true,
    kind: "continuation",
    f,
    debug,
  } satisfies Omit<ContinuationRune, "event"> as never
}

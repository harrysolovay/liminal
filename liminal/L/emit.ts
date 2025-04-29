import { Rune, RuneKey } from "../Rune.ts"

export function* emit<const E>(event: E): Generator<Rune<E>, void> {
  return yield {
    [RuneKey]: true,
    value: {
      kind: "event",
      event,
    },
  }
}

import type { LEventRune } from "../Rune.ts"

export function* event<K extends keyof any, V>(key: K, value: V): Generator<LEventRune<K, V>> {
  return yield {
    type: "event",
    key,
    value,
  }
}

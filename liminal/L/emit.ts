import type { EmitRune } from "../Rune.ts"

export function* emit<K extends keyof any, V>(key: K, value: V): Generator<EmitRune<K, V>> {
  return yield {
    type: "emit",
    key,
    value,
  }
}

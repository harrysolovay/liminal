import type { Await } from "../Rune.ts"

export function* awaited<V>(value: V): Generator<Await, Awaited<V>> {
  return yield {
    type: "await",
    value,
  }
}

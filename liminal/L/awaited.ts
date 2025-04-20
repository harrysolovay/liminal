import type { AwaitRune } from "../Rune.ts"

export function* awaited<V>(value: V): Generator<AwaitRune, Awaited<V>> {
  return yield {
    type: "await",
    value,
  }
}

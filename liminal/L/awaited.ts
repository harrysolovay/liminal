import type { AwaitRune } from "../Rune.ts"

export interface awaited extends Generator<AwaitRune, Awaited<any>> {}

export function* awaited<V>(value: V): awaited {
  return yield {
    type: "await",
    value,
  }
}

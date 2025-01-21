import type { Rune, Runic } from "./_Rune.ts"

export function declareRune<K extends string, T>(
  kind: K,
  self: () => Runic<Rune<K, T>>,
  args?: Array<unknown>,
): Rune<K, T> {
  return {
    ...{} as { T: never },
    kind,
    self,
    args,
    *[Symbol.iterator]() {
      return yield this
    },
  } satisfies Rune<K, T>
}

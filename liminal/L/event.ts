import type { Rune } from "../Rune.ts"

export interface event<_K extends keyof any, _V> extends Generator<Rune, void> {}

export function* event<K extends keyof any, V = undefined>(key: K, value: V = undefined as V): event<K, V> {
  return yield (fiber) => {
    fiber.globals.handler({
      type: "event",
      key,
      value,
    })
  }
}

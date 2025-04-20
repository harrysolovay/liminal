import type { EventRune } from "../Rune.ts"

export interface event<K extends keyof any, V> extends Generator<EventRune<K, V>, void> {}

export function* event<K extends keyof any, V = undefined>(key: K, value: V = undefined as V): event<K, V> {
  return yield {
    type: "event",
    key,
    ...value && { value },
  }
}

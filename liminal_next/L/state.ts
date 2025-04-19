import type { State } from "../Rune.ts"

export function* state<T>(constructor: new() => T, value?: T): Generator<State, T> {
  return yield {
    type: "state",
    constructor,
    value,
  }
}

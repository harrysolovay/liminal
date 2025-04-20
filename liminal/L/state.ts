import type { StateRune } from "../Rune.ts"
import type { StateConstructor } from "../StateMap.ts"

export function* state<CA extends Array<StateConstructor>>(
  ...constructors: CA
): Generator<StateRune, { [I in keyof CA]: InstanceType<CA[I]> }> {
  return yield {
    type: "state",
    constructors,
  }
}

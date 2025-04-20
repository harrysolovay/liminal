import type { StateRune } from "../Rune.ts"
import type { StateConstructor } from "../StateMap.ts"

export interface state<CA extends Array<StateConstructor>>
  extends Generator<StateRune, { [I in keyof CA]: InstanceType<CA[I]> }>
{}

export function* state<CA extends Array<StateConstructor>>(...constructors: CA): state<CA> {
  return yield {
    type: "state",
    constructors,
  }
}

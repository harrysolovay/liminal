import type { Rune } from "../Rune.ts"
import type { StateConstructor } from "../StateMap.ts"

export interface state<CA extends Array<StateConstructor>>
  extends Generator<Rune, { [I in keyof CA]: InstanceType<CA[I]> }>
{}

export function* state<CA extends Array<StateConstructor>>(...constructors: CA): state<CA> {
  return yield (fiber) => {
    return constructors.map((constructor) => {
      let instance = fiber.state.get(constructor)
      if (!instance) {
        instance = new constructor()
        fiber.state.set(constructor, instance)
      }
      return instance
    }) as never // TODO
  }
}

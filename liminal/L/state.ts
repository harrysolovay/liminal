import type { Rune } from "../Rune.ts"
import type { StateConstructor } from "../StateMap.ts"
import { rune } from "./rune.ts"

export interface state<CA extends Array<StateConstructor>>
  extends Generator<Rune<never>, { [I in keyof CA]: InstanceType<CA[I]> }>
{}

export function* state<CA extends Array<StateConstructor>>(...constructors: CA): state<CA> {
  return yield* rune((fiber) => {
    return constructors.map((constructor) => {
      let instance = fiber.state.get(constructor)
      if (!instance) {
        instance = new constructor()
        fiber.state.set(constructor, instance)
      }
      return instance
    }) as never
  })
}

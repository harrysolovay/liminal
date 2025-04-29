import type { Definition } from "../Definition.ts"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import { continuation } from "./continuation.ts"
import { current } from "./current.ts"

export { catch_ as catch }

function* catch_<Y extends Rune<any>, T>(
  definition: Definition<Y, T>,
): Generator<Rune<LEvent> | Rune<Y>, CatchResult<T>> {
  const strand = yield* current
  return yield* continuation("catch", async () => {
    try {
      const resolved = await new Strand(definition, {
        parent: strand,
        context: strand.config.context?.inheritance(),
      }).then()
      return { resolved }
    } catch (exception: unknown) {
      return { rejected: exception }
    }
  })
}
Object.defineProperty(catch_, "name", { value: "catch" })

export type CatchResult<T> = {
  resolved: T
  rejected?: never
} | {
  resolved?: never
  rejected: unknown
}

import type { Definition } from "../Definition.ts"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import { continuation } from "./continuation.ts"
import { reflect } from "./reflect.ts"

export { catch_ as catch }

/**
 * Error handling utility that catches exceptions from running a definition.
 * Returns a result object indicating whether the operation succeeded or failed.
 */
function* catch_<Y extends Rune<any>, T>(
  definition: Definition<Y, T>,
): Generator<Rune<LEvent> | Rune<Y>, CatchResult<T>> {
  const parent = yield* reflect
  return yield* continuation("catch", async () => {
    try {
      const resolved = await new Strand(definition, {
        parent,
        context: parent.context.clone(),
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

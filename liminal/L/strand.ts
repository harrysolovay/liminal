import type { Context } from "../Context.ts"
import type { Definition } from "../Definition.ts"
import type { LEvent } from "../LEvent.ts"
import { type Rune, RuneKey } from "../Rune.ts"

/**
 * Creates a child strand that executes a definition.
 * Optionally specify the context. Otherwise the current context is inherited.
 */
export function* strand<Y extends Rune<any>, T>(
  definition: Definition<Y, T>,
  context?: Context,
): Generator<Rune<LEvent>, T> {
  return yield {
    [RuneKey]: true,
    instruction: {
      kind: "create_child",
      definition,
      context,
    },
  }
}

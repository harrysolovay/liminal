import { Action } from "../Action.ts"
import type { EmbeddedEvent } from "../events/EmbeddedEvent.ts"
import type { EmbeddingRequestedEvent } from "../events/EmbeddingRequestedEvent.ts"
import { assert } from "../util/assert.ts"

export function* embed(value: string): Generator<
  Action<"embed", {
    Entry: never
    Event: EmbeddingRequestedEvent | EmbeddedEvent
    Throw: never
  }>,
  Array<number>
> {
  return yield Action("embed", async (scope) => {
    assert(scope.runEmbed)
    scope.event({
      type: "embedding_requested",
      value,
    })
    const embedding = await scope.runEmbed(value)
    scope.event({
      type: "embedded",
      value,
      embedding,
    })
    return {
      ...scope,
      nextArg: scope.value,
    }
  })
}

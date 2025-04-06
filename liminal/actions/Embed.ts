import { Action, type EventBase } from "../Action.ts"
import { assert } from "../util/assert.ts"

export function* embed(value: string): Generator<
  Action<"embed", {
    Entry: never
    Event: EmbeddedEvent | EmbeddingRequestedEvent
    Throw: never
  }>,
  Array<number>
> {
  return yield Action<never>()("embed", async (scope) => {
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

export interface EmbeddingRequestedEvent extends EventBase<"embedding_requested"> {
  value: string
}

export interface EmbeddedEvent extends EventBase<"embedded"> {
  value: string
  embedding: Array<number>
}

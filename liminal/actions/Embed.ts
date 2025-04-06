import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import { ActionBase, type EventBase } from "./actions_base.ts"

export interface Embed<S extends Spec = Spec> extends ActionBase<"embed", S> {
  value: string
}

export function* embed(value: string): Generator<
  Embed<{
    Entry: never
    Event: EmbeddedEvent | EmbeddingRequestedEvent
  }>,
  Array<number>
> {
  return yield ActionBase("embed", {
    value,
    async reduce(scope) {
      assert(scope.runEmbed)
      scope.event({
        type: "embedding_requested",
        value,
      })
      const embedding = await scope.runEmbed(this, scope)
      scope.event({
        type: "embedded",
        value,
        embedding,
      })
      return {
        ...scope,
        nextArg: scope.value,
      }
    },
  })
}

export interface EmbeddingRequestedEvent extends EventBase<"embedding_requested"> {
  value: string
}

export interface EmbeddedEvent extends EventBase<"embedded"> {
  value: string
  embedding: Array<number>
}

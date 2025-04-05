import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"

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
      scope.events.emit({
        type: "embedding_requested",
        value,
      })
      const embedding = await scope.runEmbed(this, scope)
      scope.events.emit({
        type: "embedded",
        value,
        embedding,
      })
      return scope.spread({
        next: scope.result,
      })
    },
  })
}

export interface EmbeddingRequestedEvent extends ActionEventBase<"embedding_requested"> {
  value: string
}

export interface EmbeddedEvent extends ActionEventBase<"embedded"> {
  value: string
  embedding: Array<number>
}

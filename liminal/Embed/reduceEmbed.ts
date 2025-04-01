import type { ActionReducer } from "../Action/ActionReducer.ts"
import { assert } from "../util/assert.ts"
import type { Embed } from "./Embed.ts"

export const reduceEmbed: ActionReducer<Embed> = async (action, scope) => {
  assert(scope.embed)
  scope.events.emit({
    type: "embedding_requested",
    value: action.value,
  })
  const embedding = await scope.embed(action, scope)
  scope.events.emit({
    type: "embedded",
    value: action.value,
    embedding,
  })
  return scope.spread({
    next: scope.result,
  })
}

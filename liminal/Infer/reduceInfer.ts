import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { assert } from "../util/assert.ts"
import type { Infer } from "./Infer.ts"

export const reduceInfer: ActionReducer<Infer> = async (action, scope) => {
  assert(scope.infer)
  scope.events.emit({
    type: "inference_requested",
  })
  scope = await reduceActor(scope.infer(action, scope), scope)
  scope.events.emit({
    type: "inferred",
    value: scope.result,
  })
  return scope.spread({
    next: scope.result,
  })
}

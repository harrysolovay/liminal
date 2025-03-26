import type { Action } from "./Action.js"
import type { ActorLike } from "../common/ActorLike.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { ActionEvent } from "./ActionEvent.js"

export function* Context<Y extends Action, R = string>(
  system: string | undefined,
  implementation: ActorLike<Y, R>,
): Generator<Context, Awaited<R>> {
  return yield ActionBase("Context", {
    system,
    implementation,
  })
}

export interface Context extends ActionBase<"Context"> {
  system: string | undefined
  implementation: ActorLike
}

export interface ContextEvent<E extends ActionEvent = ActionEvent> extends EventBase<"Context"> {
  inner: E
}

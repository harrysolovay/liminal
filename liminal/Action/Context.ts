import type { Action } from "./Action.js"
import type { ActorLike } from "../common/ActorLike.js"

export function* Context<Y extends Action, R = string>(
  system: string | undefined,
  implementation: ActorLike<Y, R>,
): Generator<Context, Awaited<R>> {
  return yield {
    kind: "Context",
    system,
    implementation,
  }
}

export interface Context {
  kind: "Context"
  system: string | undefined
  implementation: ActorLike
}

export interface ContextEvent<E extends Event = Event> {
  type: "Context"
  event: E
}

import type { Action } from "./Action.ts"
import type { ActorLike } from "./Actor.ts"
import type { EventHandler } from "./EventHandler.ts"
import { RootScope, type Scope } from "./Scope.ts"
import type { Spec } from "./Spec.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export interface ExecConfig<S extends Action = Action, T = any> {
  bind: FromEntries<S[""]["Entry"]>
  handler?: EventHandler<S[""]["Event"], T>
}

export async function exec<Y extends Action, T>(
  actorLike: ActorLike<Y, T>,
  config: ExecConfig<Y, T>,
): Promise<T> {
  // TODO: swap out `exec-key` with id formed based on call site.
  let scope: Scope = RootScope("exec", "exec-key", config.bind, config.handler)
  const actor = unwrapDeferred(actorLike)
  scope = await scope.reduce(actor)
  const { signal } = scope.controller
  if (signal.aborted) {
    throw signal.reason
  }
  scope.event({
    type: "returned",
    value: scope.value,
  })
  return scope.value
}

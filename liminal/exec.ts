import type { Action } from "./Action.ts"
import type { ActorLike } from "./Actor.ts"
import type { EventHandler } from "./EventHandler.ts"
import { RootScope, type Scope } from "./Scope.ts"
import type { Spec } from "./Spec.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export interface ExecConfig<T = any, S extends Spec = Spec> {
  bind: FromEntries<S["Entry"]>
  handler?: EventHandler<S["Event"], T>
}

export async function exec<Y extends Action, T>(
  actorLike: ActorLike<Y, T>,
  config: ExecConfig<T, Y[""]>,
): Promise<RootScope<T>> {
  let scope: Scope = RootScope("exec", "exec", config.bind, config.handler)
  const actor = unwrapDeferred(actorLike)
  scope = await scope.reduce(actor)
  scope.event({
    type: "returned",
    value: scope.value,
  })
  return scope as never
}

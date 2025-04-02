import { ActionEvents } from "./ActionEvents.ts"
import type { EnteredEvent, ExitedEvent } from "./actions/actions_base.ts"
import type { ActionLike } from "./Actor/ActionLike.ts"
import type { ActorLike } from "./Actor/ActorLike.ts"
import { reduce } from "./Actor/reduce.ts"
import { Scope } from "./Scope.ts"
import type { ExtractSpec, Spec } from "./Spec.ts"
import type { U2I } from "./util/U2I.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export interface ExecConfig<T = any, S extends Spec = Spec> {
  bind: U2I<S["Field"]>
  handler?: (event: EnteredEvent | S["Event"] | ExitedEvent<T>) => any
}

export async function exec<Y extends ActionLike, T, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, T>,
  config: ExecConfig<T, S>,
): Promise<Scope<any>> {
  const actor = unwrapDeferred(actorLike)
  const events = new ActionEvents((inner) => inner, config.handler)
  events.emit({
    type: "entered",
  })
  let scope = new Scope(config.bind as never, undefined, events)
  scope = await reduce(actor, scope)
  events.emit({
    type: "exited",
    result: scope.result,
  })
  return scope
}

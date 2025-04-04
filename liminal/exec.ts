import type { ActionLike } from "./Action.ts"
import { ActionEvents } from "./ActionEvents.ts"
import type { EnteredEvent, ExitedEvent } from "./actions/actions_common.ts"
import type { ActorLike } from "./Actor.ts"
import { reduce } from "./reduceActor.ts"
import { Scope } from "./Scope.ts"
import type { ExtractSpec, Spec } from "./Spec.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export interface ExecConfig<T = any, S extends Spec = Spec> {
  bind: FromEntries<S["Entry"]>
  handler?: (event: EnteredEvent | S["Event"] | ExitedEvent<T>) => any
}

export async function exec<Y extends ActionLike, T>(
  actorLike: ActorLike<Y, T>,
  config: ExecConfig<T, ExtractSpec<Y>>,
): Promise<Scope<T>> {
  const actor = unwrapDeferred(actorLike)
  const events = new ActionEvents((inner) => inner, config.handler)
  events.emit({
    type: "entered",
  })
  let scope = new Scope("exec", config.bind as never, undefined, events)
  scope = await reduce(actor, scope)
  events.emit({
    type: "exited",
    result: scope.result,
  })
  return scope
}

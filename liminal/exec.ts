import type { ActionEventBase, EnteredEvent, ExitedEvent } from "./Action/ActionEventBase.ts"
import type { ActionLike } from "./Action/ActionLike.ts"
import type { ActorLike } from "./Actor/ActorLike.ts"
import { reduceActor } from "./Actor/reduceActor.ts"
import { Events } from "./Events.ts"
import { Scope } from "./Scope/Scope.ts"
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
  const events = new Events((inner) => inner, config.handler)
  events.emit({
    type: "entered",
  })
  let scope = new Scope(config.bind as never, undefined, events)
  scope = await reduceActor(actor, scope)
  events.emit({
    type: "exited",
    result: scope.result,
  })
  return scope
}

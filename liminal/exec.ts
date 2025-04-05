import type { Action } from "./Action.ts"
import { ActionEvents } from "./ActionEvents.ts"
import type { EnteredEvent, ExitedEvent } from "./actions/actions_common.ts"
import type { ActorLike } from "./Actor.ts"
import { Scope } from "./Scope.ts"
import type { Spec } from "./Spec.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export interface ExecConfig<T = any, S extends Spec = Spec> {
  bind: FromEntries<S["Entry"]>
  handler?: (event: EnteredEvent | S["Event"] | ExitedEvent<T>) => any
}

export async function exec<Y extends Action, T>(
  actorLike: ActorLike<Y, T>,
  config: ExecConfig<T, Y[""]>,
): Promise<Scope<T>> {
  const actor = unwrapDeferred(actorLike)
  const events = new ActionEvents((inner) => inner, config.handler)
  events.emit({
    type: "entered",
  })
  const scope = await new Scope("exec", config.bind as never, undefined, events).reduce(actor)
  events.emit({
    type: "exited",
    result: scope.result,
  })
  return scope
}

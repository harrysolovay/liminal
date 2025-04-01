import type { ActionLike } from "../Action/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { Events } from "../Events.ts"
import { Scope } from "../Scope/Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { ExecEnteredEvent, ExecExitedEvent } from "./ExecEvent.ts"

export interface Exec<S extends Spec, T> {
  exec: (handler?: (event: ExecEnteredEvent | S["Event"] | ExecExitedEvent<T>) => any) => Promise<Scope<T>>
}

export function Exec<Y extends ActionLike, T, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, T>,
): Exec<S, T> {
  return {
    exec: async (handler) => {
      const actor = unwrapDeferred(actorLike)
      let scope = new Scope(undefined, new Events((inner) => inner, handler))
      scope.events.emit({
        type: "exec_entered",
      })
      scope = await reduceActor(scope, actor)
      scope.events.emit({
        type: "exec_exited",
        result: scope.result,
      })
      return scope
    },
  }
}

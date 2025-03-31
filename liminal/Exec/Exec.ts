import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { ExtractModelAdapters } from "../Config.js"
import { Events } from "../Events.js"
import { Scope } from "../Scope/Scope.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { ExecEnteredEvent, ExecExitedEvent } from "./ExecEvent.js"

export interface Exec<S extends Spec, T> {
  exec: (handler?: (event: ExecEnteredEvent | S["Event"] | ExecExitedEvent<T>) => any) => Promise<Scope<T>>
}

export interface ExecBuilder<S extends Spec, R> {
  models: (models: ExtractModelAdapters<S>) => Exec<S, R>
}

export function Exec<Y extends ActionLike, T, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, T>,
): ExecBuilder<S, T> {
  return {
    models: (models) => ({
      exec: async (handler) => {
        let scope = new Scope(
          models,
          undefined,
          unwrapDeferred(actorLike),
          new Events((inner) => inner, handler),
        )
        scope.events.emit({
          type: "exec_entered",
        })
        scope = await reduceActor(scope)
        scope.events.emit({
          type: "exec_exited",
          result: scope.result,
        })
        return scope
      },
    }),
  }
}

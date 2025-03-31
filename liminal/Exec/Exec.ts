import type { ActionLike } from "../Action/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { Events } from "../Events.ts"
import type { ExtractModelAdapters } from "../ModelAdapters.ts"
import { Scope } from "../Scope/Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { ExecEnteredEvent, ExecExitedEvent } from "./ExecEvent.ts"

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

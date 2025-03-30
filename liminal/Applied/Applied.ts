import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { ExtractModelAdapters } from "../Config.js"
import { Events } from "../Events.js"
import { Scope } from "../Scope/Scope.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export interface Applied<S extends Spec, T> {
  reduce: (handler?: (event: S["Event"]) => any) => Promise<Scope<T>>
}

export function Applied<Y extends ActionLike, R, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, R>,
  models: ExtractModelAdapters<S>,
): Applied<S, R> {
  return {
    reduce: (handler) =>
      reduceActor(
        new Scope(
          models,
          undefined,
          unwrapDeferred(actorLike),
          new Events((inner) => inner, handler),
        ),
      ),
  }
}

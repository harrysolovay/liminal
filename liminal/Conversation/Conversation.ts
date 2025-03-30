import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import { Applied as Applied } from "../Applied/Applied.js"
import type { ExtractModelAdapters } from "../Config.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export interface Exec<S extends Spec, R> {
  models: (models: ExtractModelAdapters<S>) => Applied<S, R>
  // TODO: spec type test here
}

export function Exec<Y extends ActionLike, R, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, R>,
): Exec<S, R> {
  return {
    models: (models) => Applied(actorLike, models),
  }
}

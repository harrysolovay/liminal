import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractModelAdapters } from "../Config.js"
import { ExecApplied as ExecApplied } from "../ExecApplied/ExecApplied.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export interface Exec<S extends Spec, R> {
  models: (models: ExtractModelAdapters<S>) => ExecApplied<S, R>
}

export function Exec<Y extends ActionLike, R, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, R>,
): Exec<S, R> {
  return {
    models: (models) => ExecApplied(actorLike, models),
  }
}

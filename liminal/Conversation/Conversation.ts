import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractModelAdapters } from "../Config.js"
import { ExecutableConversation } from "../ExecutableConversation/ExecutableConversation.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export interface Conversation<S extends Spec, R> {
  models: (models: ExtractModelAdapters<S>) => ExecutableConversation<S, R>
}

export function Conversation<Y extends ActionLike, R, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, R>,
): Conversation<S, R> {
  return {
    models: (models) => ExecutableConversation(actorLike, models),
  }
}

import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { ExtractModelAdapters } from "../Config.js"
import { Events } from "../Events.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import { State } from "../State/State.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export interface ExecutableConversation<S extends Spec, T> {
  reduce: (handler?: (event: S["Event"]) => any) => Promise<State<T>>
}

export function ExecutableConversation<Y extends ActionLike, R, S extends ExtractSpec<Y>>(
  actorLike: ActorLike<Y, R>,
  models: ExtractModelAdapters<S>,
): ExecutableConversation<S, R> {
  return {
    reduce: (handler) => {
      const state = State({
        kind: "Context",
        models,
        model: {},
        actor: unwrapDeferred(actorLike),
        events: new Events((inner) => inner, handler),
        messages: [],
        tools: new Set(),
        children: [],
        result: undefined,
      })
      return reduceActor(state)
    },
  }
}

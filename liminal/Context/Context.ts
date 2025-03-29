import { ActionBase } from "../Action/ActionBase.js"
import type { ActionLike } from "../Action/ActionLike.js"
import { Events } from "../ActionEventSource.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { ExtractConfig } from "../Config.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import { State } from "../State/State.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { ContextEvent } from "./ContextEvent.js"

export interface Context<S extends Spec = Spec> extends ActionBase<"Context", S> {
  key: string
  system: string | undefined
  implementation?: ActorLike
}

export interface ContextGenerator<Y extends ActionLike = ActionLike, T = any> extends IteratorObject<Y, T> {
  exec(config: ExtractConfig<Y>): Promise<State<T>>
}

export function Context<K extends string, Y extends ActionLike, S extends ExtractSpec<Y>, R = string>(
  key: K,
  system: string,
  implementation: ActorLike<Y, R>,
): ContextGenerator<
  Context<{
    LanguageModel: S["LanguageModel"]
    EmbeddingModel: S["EmbeddingModel"]
    Event: ContextEvent<K, S["Event"], R>
  }>,
  Awaited<R>
>
export function Context<K extends string, Y extends ActionLike, S extends ExtractSpec<Y>, R = string>(
  key: K,
  implementation: ActorLike<Y, R>,
): ContextGenerator<
  Context<{
    LanguageModel: S["LanguageModel"]
    EmbeddingModel: S["EmbeddingModel"]
    Event: ContextEvent<K, S["Event"], R>
  }>,
  Awaited<R>
>
export function Context<Y extends ActionLike, R = string>(
  key: string,
  a1: string | ActorLike,
  a2?: ActorLike,
): ContextGenerator<Context, Awaited<R>> {
  return Object.assign(gen(), { exec })

  function* gen(): Generator<Context, Awaited<R>> {
    return yield ActionBase("Context", {
      key,
      system: typeof a1 === "string" ? a1 : undefined,
      implementation: typeof a1 === "string" ? a2 : a1,
    })
  }

  function exec(config: ExtractConfig<Y>): Promise<State> {
    const state = State({
      kind: "Context",
      key,
      config,
      model: {},
      actor: unwrapDeferred(typeof a1 === "string" ? a2! : a1),
      events: new Events((inner) => inner, config.handler),
      messages: [],
      tools: new Set(),
      children: [],
      result: undefined,
    })
    return reduceActor(state)
  }
}

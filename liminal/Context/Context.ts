import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { EventBase } from "../Action/ActionEventBase.js"
import type { ActionEvent } from "../Action/ActionEvent.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { ExtractConfig } from "../Config.js"
import { State } from "../State/State.js"
import { Events } from "../ActionEventSource.js"
import { reduceActor } from "../Actor/reduceActor.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

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

export type ContextEvent<K extends string = string, E extends ActionEvent = any, T = any> =
  | ContextEnterEvent<K>
  | ContextInnerEvent<K, E>
  | ContextExitEvent<K, T>

export interface ContextEnterEvent<K extends string> extends EventBase<"ContextEnter"> {
  context: K
  system?: string
}

export interface ContextInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"ContextInner"> {
  context: K
  inner: E
}

export interface ContextExitEvent<K extends string, T> extends EventBase<"ContextExit"> {
  context: K
  result: T
}

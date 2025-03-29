import type { ActionLike } from "./Action.js"
import type { ActorLike } from "../common/ActorLike.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./EventBase.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { ExtractSpec, Spec } from "../Spec.js"
import type { NarrowExecConfig } from "../ExecConfig.js"
import { ExecState } from "../ExecState.js"
import { Events } from "../ActionEventSource.js"
import { StateReducers } from "../StateReducers/StateReducers.js"
import { reduceActor } from "../StateReducers/reduceActor.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export interface Context<S extends Spec = Spec> extends ActionBase<"Context", S> {
  key: string
  system: string | undefined
  implementation?: ActorLike
}

export interface ContextGenerator<Y extends ActionLike = ActionLike, T = any> extends IteratorObject<Y, T> {
  exec(config: NarrowExecConfig<Y>): Promise<ExecState<T>>
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

  function exec(config: NarrowExecConfig<Y>): Promise<ExecState> {
    const state = ExecState({
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
    return reduceActor(StateReducers, state)
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

import type { ActionLike } from "./Action.js"
import type { ActorLike } from "../common/ActorLike.js"
import { ActionBase } from "./ActionBase.js"
import type { EnterEvent, EventBase, ExitEvent } from "./event_common.js"
import type { ActionEvent } from "./ActionEvent.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export function Context<K extends string, Y extends ActionLike, S extends ExtractSpec<Y>, R = string>(
  key: K,
  system: string,
  implementation: ActorLike<Y, R>,
): Generator<
  Context<{
    LanguageModel: S["LanguageModel"]
    EmbeddingModel: S["EmbeddingModel"]
    Event: ContextEvent<K, EnterEvent | S["Event"] | ExitEvent<R>>
  }>,
  Awaited<R>
>
export function Context<K extends string, Y extends ActionLike, S extends ExtractSpec<Y>, R = string>(
  key: K,
  implementation: ActorLike<Y, R>,
): Generator<
  Context<{
    LanguageModel: S["LanguageModel"]
    EmbeddingModel: S["EmbeddingModel"]
    Event: ContextEvent<K, EnterEvent | S["Event"] | ExitEvent<R>>
  }>,
  Awaited<R>
>
export function* Context<Y extends ActionLike, R = string>(
  key: string,
  a0: string | ActorLike,
  a1?: ActorLike,
): Generator<Context, Awaited<R>> {
  return yield ActionBase("Context", {
    key,
    system: typeof a0 === "string" ? a0 : undefined,
    implementation: typeof a0 === "string" ? a1 : a0,
  })
}

export interface Context<S extends Spec = Spec> extends ActionBase<"Context", S> {
  key: string
  system: string | undefined
  implementation?: ActorLike
}

export interface ContextEvent<K extends string = string, E extends ActionEvent = ActionEvent>
  extends EventBase<"Context"> {
  key: K
  inner: E
}

import { ActionBase } from "../Action/ActionBase.ts"
import type { EnteredEvent, ExitedEvent } from "../Action/ActionEventBase.ts"
import type { ActionLike } from "../Action/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import type { ContextEvent } from "./ContextEvent.ts"

export interface Context<S extends Spec = Spec> extends ActionBase<"context", S> {
  key: keyof any
  implementation: ActorLike
}

export function* context<K extends keyof any, Y extends ActionLike, S extends ExtractSpec<Y>, T = string>(
  key: K,
  implementation: ActorLike<Y, T>,
): Generator<
  Context<{
    Field: S["Field"]
    Event: ContextEvent<K, EnteredEvent | S["Event"] | ExitedEvent<T>>
  }>,
  T
> {
  return yield ActionBase("context", {
    key,
    implementation,
  })
}

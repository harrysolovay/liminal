import { ActionBase } from "../Action/ActionBase.ts"
import type { EnteredEvent, ExitedEvent } from "../Action/ActionEventBase.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import type { ForkArmEvent, ForkEvent } from "./ForkEvent.ts"

export interface Fork<S extends Spec = Spec> extends ActionBase<"fork", S> {
  key: keyof any
  arms: ForkArms
}

export type ForkArms = Array<ActorLike> | Record<keyof any, ActorLike>

export function fork<K extends keyof any, const B extends Array<ActorLike>>(
  key: K,
  arms: B,
): Generator<
  Fork<
    {
      // TODO: fix this
      Field: B[number] extends ActorLike<infer Y> ? ExtractSpec<Y>["Field"] : never
      Event: ForkEvent<
        K,
        | EnteredEvent
        | {
          [L in keyof B]: B[L] extends ActorLike<infer Y, infer T>
            ? ExtractSpec<Y> extends infer S extends Spec
              ? EnteredEvent | ForkArmEvent<L, EnteredEvent | S["Event"] | ExitedEvent<T>>
            : never
            : never
        }[number]
        | ExitedEvent<ForkResult<B>>
      >
    }
  >,
  ForkResult<B>
>
export function fork<K extends keyof any, B extends Record<keyof any, ActorLike>>(
  key: K,
  arms: B,
): Generator<
  Fork<
    {
      Field: B[keyof B] extends ActorLike<infer Y> ? ExtractSpec<Y>["Field"] : never
      Event: ForkEvent<
        K,
        | EnteredEvent
        | {
          [L in keyof B]: B[L] extends ActorLike<infer Y, infer T>
            ? ExtractSpec<Y> extends infer S extends Spec ? EnteredEvent | S["Event"] | ExitedEvent<T>
            : never
            : never
        }[keyof B]
        | ExitedEvent<ForkResult<B>>
      >
    }
  >,
  ForkResult<B>
>
export function* fork<B extends ForkArms>(
  key: keyof any,
  arms: B,
): Generator<Fork, ForkResult<B>> {
  return yield ActionBase("fork", {
    key,
    arms,
  })
}

export type ForkResult<B> = [{ [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }][0]

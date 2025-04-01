import { ActionBase } from "../Action/ActionBase.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import type {
  ForkArmEnteredEvent,
  ForkArmExitedEvent,
  ForkArmInnerEvent,
  ForkEnteredEvent,
  ForkExitedEvent,
} from "./ForkEvent.ts"

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
    | {
      LanguageModel: never
      EmbeddingModel: never
      Event: ForkEnteredEvent<K> | ForkExitedEvent<K, ForkResult<B>>
    }
    | {
      [L in keyof B]: B[L] extends ActorLike<infer Y, infer R> ? ExtractSpec<Y> extends infer S extends Spec ? {
            LanguageModel: S["LanguageModel"]
            EmbeddingModel: S["EmbeddingModel"]
            Event:
              | ForkArmEnteredEvent<K, L>
              | ForkArmInnerEvent<K, L, S["Event"]>
              | ForkArmExitedEvent<K, L, Awaited<R>>
          }
        : never
        : never
    }[number]
  >,
  ForkResult<B>
>
export function fork<K extends keyof any, B extends Record<keyof any, ActorLike>>(
  key: K,
  branches: B,
): Generator<
  Fork<
    | {
      LanguageModel: never
      EmbeddingModel: never
      Event: ForkEnteredEvent<K> | ForkExitedEvent<K, ForkResult<B>>
    }
    | {
      [L in keyof B]: B[L] extends ActorLike<infer Y, infer R> ? ExtractSpec<Y> extends infer S extends Spec ? {
            LanguageModel: S["LanguageModel"]
            EmbeddingModel: S["EmbeddingModel"]
            Event:
              | ForkArmEnteredEvent<K, L>
              | ForkArmInnerEvent<K, L, S["Event"]>
              | ForkArmExitedEvent<K, L, Awaited<R>>
          }
        : never
        : never
    }[keyof B]
  >,
  ForkResult<B>
>
export function* fork<B extends ForkArms>(
  key: keyof any,
  branches: B,
): Generator<Fork, ForkResult<B>> {
  return yield ActionBase("fork", {
    key,
    arms: branches,
  })
}

export type ForkResult<B> = [{ [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }][0]

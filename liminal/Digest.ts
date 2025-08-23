import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Schema from "effect/Schema"
import type { Thread } from "./Thread.ts"
import { prefix } from "./util/prefix.ts"

export const DigestTypeId: unique symbol = Symbol.for(prefix("Digest"))
export type DigestTypeId = typeof DigestTypeId

export declare const Digest: <const K extends string, A = string, I = string>(
  key: K,
  schema?: Schema.Schema<A, I>,
) => <Self>() => DigestClass<K, A, I, Self>

export interface DigestClass<K extends string, A, I, Self> extends Effect.Effect<A, never, Self> {
  new(_: never): this

  readonly Type: A
  readonly Encoded: I
  readonly [DigestTypeId]: DigestTypeId
  readonly key: K
  readonly digest: Effect.Effect<void, never, Self>
  readonly layer: <E, R>(
    f: (
      state: Option.Option<A>,
      inbox: Thread,
    ) => Effect.Effect<A, E, R>,
  ) => Layer.Layer<Self, E, Exclude<R, Self | Thread>>
}

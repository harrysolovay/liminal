export {}

// import * as Effect from "effect/Effect"
// import * as Effectable from "effect/Effectable"
// import * as Schema from "effect/Schema"
// import type { Thread } from "./Thread.ts"
// import { prefix } from "./util/prefix.ts"

// export const DigestTypeId: unique symbol = Symbol.for(prefix("Digest"))
// export type DigestTypeId = typeof DigestTypeId

// export interface Digest<A, I, S> extends Effect.Effect<A, never, Thread> {
//   new(_: never): S
//   readonly schema: Schema.Schema<A, I>
// }

// export const Digest = <K extends string, A, I>(key: K, schema: Schema.Schema<A, I>) => <S>(): Digest<A, I, S> =>
//   class extends Effectable.Class<A, never, Thread> {
//     commit = () => {
//       throw 0
//     }
//   }

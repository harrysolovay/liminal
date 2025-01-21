import type { Rune } from "./_Rune.ts"
import type { Action } from "./Action.ts"
import type { E } from "./E.ts"

export * as Thread from "./_threads/mod.ts"

export interface Thread<T = any, E = any> extends Rune<"Thread", T>, ThreadMembers<T, E> {
  E: E
}

export interface ThreadMembers<T, E> {
  // iter(): Generator<ThreadIterator<E>, Iterator<E, T, void>>
}

export interface ThreadIterator<E = any> {
  kind: "ThreadIterator"
  thread: Thread
  E: E
}

export declare const Leaf: unique symbol
export type Leaf<E = any> = { [Leaf]: E }

// type ExtractEvent

// export type ExpandEvent<E> = U2I<E> extends infer U ? Expand<
//     {
//       [K in keyof U]:
//         & { [_ in K]: U[K] }
//         & { [_ in Exclude<keyof U, K>]+?: never }
//     }[keyof U]
//   >
//   : never

import type { Expand } from "../../util/Expand.ts"
import type { U2I } from "../../util/U2I.ts"
import type { E as E_ } from "./E.ts"
import type { MessageLike } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { System } from "./System.ts"
import type { Thread, ThreadIterator } from "./Thread.ts"
import type { Type } from "./Type.ts"

export type Action = Model | System | MessageLike | Type | E_ | Thread | ThreadIterator

export namespace Action {
  export type ExtractEvent<A extends Action> = Expand<
    U2I<
      A extends Thread<any, infer E2> ? E2
        : A extends ThreadIterator<infer E2> ? E2
        : A extends E_<infer K, infer D> ? { [_ in K]: E<D> }
        : never
    >
  >

  declare const E: unique symbol
  type E<T> = { [E]: T }
}

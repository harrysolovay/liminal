import type { Expand } from "../util/Expand.ts"
import type { U2I } from "../util/U2I.ts"
import type { Directive } from "./Directive.ts"
import type { E as EAction } from "./E.ts"
import type { MessageLike } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { Relay } from "./Relay.ts"
import type { Thread } from "./Thread/mod.ts"
import type { Type } from "./Type/mod.ts"

export type Action = Model | Directive | Relay | MessageLike | Type | EAction | Thread

export type ExtractE<Y extends Action> = Y extends EAction<infer K, infer V> ? { [_ in K]: Leaf<V> }
  : Y extends Thread<any, infer E> ? E
  : never

export type ExtractMaybeE<K extends string, Y extends Action> = ExtractE<Y> extends infer E
  ? [E] extends [never] ? never : { [_ in K]: Expand<U2I<E>> }
  : never

export namespace Leaf {
  export declare const Key: unique symbol
}
export interface Leaf<V> {
  [Leaf.Key]: V
}

export type ExecEvent<ETree> = Expand<
  {
    [K in keyof ETree]:
      & { key: K }
      & (
        ETree[K] extends Leaf<infer V> ? {
            value: V
            thread?: never
          }
          : {
            value?: never
            thread: ExecEvent<ETree[K]>
          }
      )
  }[keyof ETree]
>

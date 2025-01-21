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

export type ExtractE<Y extends Action> = Expand<
  U2I<
    Y extends EAction<infer K, infer V> ? { [_ in K]: Leaf<V> }
      : Y extends Thread<any, infer E> ? E
      : never
  >
>

export namespace Leaf {
  export declare const Key: unique symbol
}
export interface Leaf<V> {
  [Leaf.Key]: V
}

export type ExecEvent<ETree> = Expand<
  {
    [K in keyof ETree]: {
      key: K
      value: ETree[K] extends Leaf<infer V> ? V : ExecEvent<ETree[K]>
    }
  }[keyof ETree]
>

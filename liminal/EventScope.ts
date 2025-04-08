import type { LEvent } from "./events/LEvent.ts"
import type { Spec } from "./Spec.ts"
import type { Expand } from "./util/Expand.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export interface EventScope<
  P extends Array<JSONKey> = Array<JSONKey>,
  E extends LEvent = any,
> {
  scope: P
  event: E
}

export type ExtractEventScope<S extends Spec, P extends Array<JSONKey> = []> =
  | ([S["Event"]] extends [never] ? never : Expand<EventScope<P, S["Event"]>>)
  | ([S["Child"]] extends [infer C extends [JSONKey, Spec]] ? {
      [L in C[0]]: ExtractEventScope<Extract<C, [L, Spec]>[1], [...P, L]>
    }[C[0]]
    : never)

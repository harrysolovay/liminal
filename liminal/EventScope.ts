import type { LEvent } from "./events/LEvent.ts"
import type { Returned } from "./events/Returned.ts"
import type { Spec } from "./Spec.ts"
import type { Expand } from "./util/Expand.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export type EventResolved = LEvent & {
  scope: Array<JSONKey>
}

export type ExtractEventScope<S extends Spec, P extends Array<JSONKey> = []> =
  | ([S["Event"]] extends [never] ? never : Expand<{ scope: P } & S["Event"]>)
  | ([S["Child"]] extends [infer C extends [JSONKey, Spec]] ? {
      [L in C[0]]: ExtractEventScope<Extract<C, [L, Spec]>[1], [...P, L]>
    }[C[0]]
    : never)
  | ([S["Value"]] extends [never] ? never : Returned<S["Value"]>)

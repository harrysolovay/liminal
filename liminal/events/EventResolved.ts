import type { Spec } from "../Spec.ts"
import type { Expand } from "../util/Expand.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { Forked } from "./Forked.ts"
import type { LEvent } from "./LEvent.ts"
import type { Returned } from "./Returned.ts"

export type EventResolved<E extends LEvent = LEvent> = E & {
  scope: Array<JSONKey>
  index: number
}

export type ExtractEventResolved<S extends Spec, P extends Array<JSONKey> = []> =
  | ([S["Event"]] extends [never] ? never
    : Expand<
      {
        scope: P
        index: number
      } & (S["Event"] | (P extends [] ? never : Forked))
    >)
  | ([S["Child"]] extends [infer C extends [JSONKey, Spec]] ? {
      [L in C[0]]: ExtractEventResolved<Extract<C, [L, Spec]>[1], [...P, L]>
    }[C[0]]
    : never)
  | ([S["Value"]] extends [never] ? never : Expand<
    {
      scope: P
      index: number
    } & Returned<S["Value"]>
  >)

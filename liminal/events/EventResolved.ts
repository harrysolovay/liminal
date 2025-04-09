import type { Spec } from "../Spec.ts"
import type { Expand } from "../util/Expand.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { LEvent } from "./LEvent.ts"
import type { Returned } from "./Returned.ts"

export type EventResolved = LEvent & {
  scope: Array<JSONKey>
}

export type ExtractEventResolved<S extends Spec, P extends Array<JSONKey> = []> =
  | ([S["Event"]] extends [never] ? never : Expand<{ scope: P } & S["Event"]>)
  | ([S["Child"]] extends [infer C extends [JSONKey, Spec]] ? {
      [L in C[0]]: ExtractEventResolved<Extract<C, [L, Spec]>[1], [...P, L]>
    }[C[0]]
    : never)
  | ([S["Value"]] extends [never] ? never : Expand<{ scope: P } & Returned<S["Value"]>>)

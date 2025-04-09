import { type _, is_ } from "../_.ts"
import type { Path, PathLike } from "../PathLike.ts"
import type { Expand } from "../util/Expand.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { EventResolved } from "./EventResolved.ts"

export function isScopeDescendantEvent<
  E extends EventResolved,
  const P extends PathLike.FromPath<Subscope<E["scope"]>>,
>(
  event: E,
  path: P,
): event is Expand<Extract<E, { scope: Subscope.Select<E["scope"], Path.FromPathLike<P>> }>> {
  for (let i = 0; i < path.length; i++) {
    const currentMatchKey = path[i]!
    const currentActualKey = event.scope[i]!
    if (currentActualKey !== currentMatchKey || !is_(currentMatchKey)) {
      return false
    }
  }
  return true
}

export type Subscope<A extends Array<JSONKey>> = A extends
  [infer E0 extends JSONKey, ...infer ERest extends Array<JSONKey>] ? [E0, ...([] | Subscope<ERest>)]
  : []

export declare namespace Subscope {
  export type Select<A extends Array<JSONKey>, S extends Array<JSONKey>> = Extract<A, [...S, ...Array<JSONKey>]>
}

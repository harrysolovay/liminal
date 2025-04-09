import { type _ } from "../_.ts"
import type { Path, PathLike } from "../PathLike.ts"
import type { Expand } from "../util/Expand.ts"
import type { EventResolved } from "./EventResolved.ts"
import { isScopeDescendantEvent } from "./isScopeDescendantEvent.ts"

export function isScopeChildEvent<E extends EventResolved, const P extends PathLike.FromPath<E["scope"]>>(
  event: E,
  path: P,
): event is Expand<Extract<E, { scope: Path.FromPathLike<P> }>> {
  if (event.scope.length !== path.length) {
    return false
  }
  return isScopeDescendantEvent(event, path as never)
}

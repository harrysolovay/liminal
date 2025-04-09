import { type _ } from "../_.ts"
import type { PathLike } from "../PathLike.ts"
import type { Expand } from "../util/Expand.ts"
import type { EventResolved } from "./EventResolved.ts"
import { isWithinSubscope } from "./isWithinSubscope.ts"

export function isWithinScope<E extends EventResolved, const P extends PathLike.Make<E["scope"]>>(
  event: E,
  path: P,
): event is Expand<Extract<E, { scope: PathLike.ToPath<P> }>> {
  if (event.scope.length !== path.length) {
    return false
  }
  return isWithinSubscope(event, path as never)
}

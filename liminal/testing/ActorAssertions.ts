import type { IsExact } from "conditional-type-checks"
import type { Action } from "../Action.ts"
import type { ActorLike } from "../Actor.ts"
import type { Spec } from "../Spec.ts"
import type { Expand } from "../util/Expand.ts"

export interface ActorAssertions<S extends Spec> {
  assertSpec<A extends Spec>(
    ...[passes]: IsExact<S, Expand<A>> extends true ? [passes?: true] : [passes: false]
  ): void
}

export function ActorAssertions<Y extends Action, R>(
  _actorLike: ActorLike<Y, R>,
): ActorAssertions<Y[""]> {
  return {
    assertSpec: () => {},
  }
}

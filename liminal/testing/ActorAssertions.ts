import type { IsExact } from "conditional-type-checks"
import type { ActionLike } from "../Action/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"

export interface ActorAssertions<S extends Spec> {
  assertSpec<A extends Spec>(...[passes]: IsExact<S, A> extends true ? [passes?: true] : [passes: false]): void
}

export function ActorAssertions<Y extends ActionLike, R>(
  _actorLike: ActorLike<Y, R>,
): ActorAssertions<ExtractSpec<Y>> {
  return {
    assertSpec: () => {},
  }
}

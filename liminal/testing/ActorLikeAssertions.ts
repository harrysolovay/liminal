import type { IsExact } from "conditional-type-checks"
import type { ActionLike } from "../Action/ActionLike.js"
import type { ActorLike } from "../Actor/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export interface ActorLikeAssertions<S extends Spec> {
  assertSpec<A extends Spec>(...[passes]: IsExact<S, A> extends true ? [passes?: true] : [passes: false]): void
}

export function ActorLikeAssertions<Y extends ActionLike, R>(
  _actorLike: ActorLike<Y, R>,
): ActorLikeAssertions<ExtractSpec<Y>> {
  return {
    assertSpec: () => {},
  }
}

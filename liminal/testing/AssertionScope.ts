import type { IsExact } from "conditional-type-checks"
import type { ActionLike } from "../Action/Action.js"
import type { ActorLike } from "../common/ActorLike.js"
import type { ExtractSpec, Spec } from "../Spec.js"

export declare function AssertionScope(
  f: (assert: {
    spec<Y extends ActionLike, R, E extends ExtractSpec<Y>>(
      actorLike: ActorLike<Y, R>,
    ): {
      equals<A extends Spec>(...[passes]: IsExact<E, A> extends true ? [passes?: true] : [passes: false]): void
    }
  }) => void,
): void

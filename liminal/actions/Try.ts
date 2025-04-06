import { Action, type EventBase } from "../Action.ts"
import type { Actor, ActorLike, ActorLikeY } from "../Actor.ts"
import type { Spec } from "../Spec.ts"
import { isIteratorLike } from "../util/isIteratorLike.ts"
import { unimplemented } from "../util/unimplemented.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { ChildEvent } from "./actions_common.ts"

function* try_<
  K extends keyof any,
  Y extends Action,
  T,
  F,
  M extends Extract<Actor, F>,
>(
  key: K,
  actorLike: ActorLike<Y, T>,
  catch_?: (thrown: unknown) => F,
): Generator<
  Action<"try", {
    Entry: (Y | ActorLikeY<M>)[""]["Entry"]
    Event: ChildEvent<
      "try",
      K,
      Y[""]["Event"] | ActorLikeY<M>[""]["Event"] | ExceptionUncaught,
      T | F extends Actor<Action, infer U> ? U : F
    >
    Throw: never
  }>,
  T
> {
  return yield Action<never>()("try", async (scope) => {
    const tryScope = scope.fork("try", key)
    const tryActor = unwrapDeferred(actorLike)
    let value: unknown
    let type: "value" | "error"
    try {
      ;({ value } = await tryScope.reduce(tryActor))
      type = "value"
    } catch (thrown: unknown) {
      if (catch_) {
        const catchResult = await catch_(thrown)
        if (isIteratorLike(catchResult)) {
          const catchScope = scope.fork("catch", key)
          ;({ value } = await catchScope.reduce(unwrapDeferred(catchResult as never)))
          type = "value"
        } else {
          type = "value"
          value = catchResult
        }
      } else {
        type = "error"
        value = thrown
      }
    }
    if (type === "value") {
      tryScope.event({
        type: "returned",
        value,
      })
      return {
        ...scope,
        nextArg: value,
      }
    }
    scope.event({
      type: "exception_uncaught",
      thrown: value,
    })
    unimplemented() // TODO: early exit
  })
}
Object.defineProperty(try_, "name", { value: "try" })
export { try_ as try }

export interface ExceptionUncaught extends EventBase<"exception_uncaught"> {
  thrown: unknown
}

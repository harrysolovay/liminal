import { Action } from "../Action.ts"
import type { ActorLike } from "../Actor.ts"
import type { ChildEvent } from "../events/ChildEvent.ts"
import type { Result } from "../util/Result.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

function* try_<K extends keyof any, Y extends Action, T>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<
  Action<"catch", {
    Entry: Y[""]["Entry"]
    Event: ChildEvent<"catch", K, Y[""]["Event"], T>
    Throw: never
  }>,
  Result<T, Y[""]["Throw"]>
> {
  return yield Action("catch", async (scope) => {
    const catchScope = scope.fork("catch", key)
    try {
      const { value } = await catchScope.reduce(unwrapDeferred(actorLike))
      return {
        ...scope,
        nextArg: { value },
      }
    } catch (thrown: unknown) {
      return {
        ...scope,
        nextArg: { thrown },
      }
    }
  })
}
Object.defineProperty(try_, "name", { value: "try" })
export { try_ as try }

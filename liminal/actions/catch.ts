import { Action } from "../Action.ts"
import type { ActorLike } from "../Actor.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { Result } from "../util/Result.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

function* catch_<K extends JSONKey, Y extends Action, T>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<
  Action<"catch", {
    Event: never
    Child: [K, Y[""]]
    Entry: never
    Throw: never
  }>,
  Result<T, any /*Y[""]["Throw"]*/>
> {
  return yield Action("catch", async (scope) => {
    const catchScope = scope.fork("catch", [key])
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
Object.defineProperty(catch_, "name", { value: "catch" })
export { catch_ as catch }

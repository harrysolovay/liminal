import { Action } from "../Action.ts"
import type { AgentLike } from "../Agent.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { Result } from "../util/Result.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export { catch_ as catch }
function* catch_<K extends JSONKey, Y extends Action, T>(
  key: K,
  agentLike: AgentLike<Y, T>,
): Generator<
  Action<
    "catch",
    Spec.Make<{
      Child: [K, Y[""]]
      Value: T
    }>
  >,
  Result<T, Y[""]["Throw"]>
> {
  return yield Action("catch", async (scope) => {
    const catchScope = scope.fork("catch", [key])
    try {
      const { value } = await catchScope.reduce(unwrapDeferred(agentLike))
      catchScope.event({
        type: "returned",
        value,
      })
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

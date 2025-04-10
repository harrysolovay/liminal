import { Action } from "../Action.ts"
import type { Agent, AgentLike, AgentLikeT, AgentLikeY } from "../Agent.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export function branch<
  K extends JSONKey,
  Y extends Action,
  T,
>(
  key: K,
  agentLike: AgentLike<Y, T>,
): Generator<
  Action<
    "branch",
    Spec.Make<{
      Child: [Y[""]] extends [never] ? never : [K, Y[""]]
      Entry: Y[""]["Entry"]
      Value: T
    }>
  >,
  T
>
export function branch<K extends JSONKey, const A extends Array<AgentLike>>(name: K, agentLikes: A): Generator<
  Action<
    "branch",
    Spec.Make<{
      Child: [
        K,
        {
          [L in keyof A]: Spec.Make<{
            Child: [L, AgentLikeY<A[L]>[""]]
            Entry: AgentLikeY<A[L]>[""]["Entry"]
            Value: AgentLikeT<A[L]>
          }>
        }[keyof A],
      ]
      Entry: AgentLikeY<A[number]>[""]["Entry"]
    }>
  >,
  AgentLikesT<A>
>
export function branch<K extends JSONKey, A extends Record<JSONKey, AgentLike>>(name: K, agentLikes: A): Generator<
  Action<
    "branch",
    Spec.Make<{
      Child: [
        K,
        {
          [L in Exclude<keyof A, symbol>]: Spec.Make<{
            Child: [L, AgentLikeY<A[L]>[""]]
            Entry: AgentLikeY<A[L]>[""]["Entry"]
            Value: AgentLikeT<A[L]>
          }>
        }[Exclude<keyof A, symbol>],
      ]
      Entry: AgentLikeY<A[keyof A]>[""]["Entry"]
    }>
  >,
  AgentLikesT<A>
>
export function* branch(key: JSONKey, a1: AgentLike | AgentLikes): Generator<Action<"branch">, any> {
  return yield Action("branch", async (scope) => {
    if (typeof a1 === "function") {
      const branchScope = scope.fork("branch", [key])
      const agent = unwrapDeferred(a1 as AgentLike)
      const { value } = await branchScope.reduce(agent)
      branchScope.event({
        type: "returned",
        value,
      })
      return {
        ...scope,
        nextArg: value,
      }
    }
    const armKeys = Array.isArray(a1)
      ? Array.from({ length: a1.length }, (_0, i) => i)
      : Reflect.ownKeys(a1) as Array<string>
    const values = await Promise.all(armKeys.map(async (armKey) => {
      const branchArmScope = scope.fork("branch_arm", [key, armKey])
      const agent = unwrapDeferred(a1[armKey as never]) as Agent
      const { value } = await branchArmScope.reduce(agent)
      branchArmScope.event({
        type: "returned",
        value,
      })
      return value
    }))
    const value = Array.isArray(a1)
      ? values
      : Object.fromEntries(armKeys.map((key, i) => [key, values[i]]))
    return {
      ...scope,
      nextArg: value,
    }
  })
}

export type AgentLikes = Array<AgentLike> | Record<JSONKey, AgentLike>
export type AgentLikesT<A extends AgentLikes> =
  & {
    -readonly [K in keyof A]: A[K] extends AgentLike<Action, infer T> ? T : never
  }
  & {}

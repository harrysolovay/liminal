import type { ActionEvent } from "../ActionEvent.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduce } from "../Actor/reduce.ts"
import { Scope } from "../Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { ActionEventBase, EnteredEvent, ExitedEvent } from "./actions_base.ts"
import { ActionBase } from "./actions_base.ts"

export interface Fork<S extends Spec = Spec> extends ActionBase<"fork", S> {
  key: keyof any
  arms: ForkArms
}

export type ForkArms = Array<ActorLike> | Record<keyof any, ActorLike>

export function fork<K extends keyof any, const B extends Array<ActorLike>>(
  key: K,
  arms: B,
): Generator<
  Fork<
    {
      // TODO: fix this
      Field: B[number] extends ActorLike<infer Y> ? ExtractSpec<Y>["Field"] : never
      Event: ForkEvent<
        K,
        | EnteredEvent
        | {
          [L in keyof B]: B[L] extends ActorLike<infer Y, infer T>
            ? ExtractSpec<Y> extends infer S extends Spec
              ? EnteredEvent | ForkArmEvent<L, EnteredEvent | S["Event"] | ExitedEvent<T>>
            : never
            : never
        }[number]
        | ExitedEvent<ForkResult<B>>
      >
    }
  >,
  ForkResult<B>
>
export function fork<K extends keyof any, B extends Record<keyof any, ActorLike>>(
  key: K,
  arms: B,
): Generator<
  Fork<
    {
      Field: B[keyof B] extends ActorLike<infer Y> ? ExtractSpec<Y>["Field"] : never
      Event: ForkEvent<
        K,
        | EnteredEvent
        | {
          [L in keyof B]: B[L] extends ActorLike<infer Y, infer T>
            ? ExtractSpec<Y> extends infer S extends Spec ? EnteredEvent | S["Event"] | ExitedEvent<T>
            : never
            : never
        }[keyof B]
        | ExitedEvent<ForkResult<B>>
      >
    }
  >,
  ForkResult<B>
>
export function* fork<B extends ForkArms>(
  key: keyof any,
  arms: B,
): Generator<Fork, ForkResult<B>> {
  return yield ActionBase("fork", {
    key,
    arms,
    async reduce(scope) {
      const armKeys = Array.isArray(arms) ? Array.from({ length: arms.length }, (_0, i) => i) : Reflect.ownKeys(arms)
      const events = scope.events.child((event) => ({
        type: "fork",
        fork: key,
        event,
      }))
      events.emit({
        type: "entered",
      })
      const armScopes = await Promise.all(
        armKeys.map(async (key) => {
          const armEvents = events.child((event) => ({
            type: "fork_arm",
            arm: key,
            event,
          }))
          armEvents.emit({
            type: "entered",
          })
          const actor = unwrapDeferred(arms[key as never]!)
          const armScope = await reduce(
            actor,
            new Scope(
              scope.args,
              key,
              armEvents,
              scope.runInfer,
              scope.runEmbed,
              [...scope.messages],
              new Set(scope.tools),
            ),
          )
          armEvents.emit({
            type: "exited",
            result: armScope.result,
          })
          return [key, armScope] as const
        }),
      )
      const result = Array.isArray(arms)
        ? armScopes.map(([_0, scope]) => scope.result)
        : Object.fromEntries(armScopes.map(([key, value]) => [key, value.result]))
      events.emit({
        type: "exited",
        result,
      })
      return scope.spread({
        next: result,
        children: [...scope.children, {
          type: "fork",
          key,
          scopes: Object.fromEntries(armScopes),
        }],
      })
    },
  })
}

export type ForkResult<B> = [{ [K in keyof B]: B[K] extends ActorLike<any, infer R> ? Awaited<R> : never }][0]

export interface ForkEvent<K extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"fork">
{
  fork: K
  event: E
}

export interface ForkArmEvent<L extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"fork_arm">
{
  arm: L
  event: E
}

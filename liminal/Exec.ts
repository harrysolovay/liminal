import type { Action } from "./Action.ts"
import type { Actor } from "./Actor.ts"
import type { RunInfer } from "./adapters.ts"
import type { EventHandler } from "./events/EventHandler.ts"
import type { EventResolved, ExtractEventResolved } from "./events/EventResolved.ts"
import { RootScope, type Scope } from "./Scope.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export interface Exec<Y extends Action = Action, T = any> {
  (
    handler?: EventHandler<Extract<ExtractEventResolved<Y[""]> & {}, EventResolved>>,
    options?: ExecOptions,
  ): Promise<T>
}

export interface ExecConfig {
  default: RunInfer
  args?: Record<JSONKey, any>
}

export interface ExecOptions {
  signal?: AbortSignal
}

export type ExtractExecConfig<Y extends Action> =
  & {
    default: RunInfer
  }
  & (
    [Y[""]["Entry"]] extends [never] ? {
        args?: undefined
      }
      : {
        args: FromEntries<Y[""]["Entry"]>
      }
  )

export function Exec<Y extends Action, T>(
  createActor: () => Actor<Y, T>,
  config: ExtractExecConfig<Y>,
): Exec<Y, T> {
  // TODO: consider `Result` type.
  return async (handler, options) => {
    let scope: Scope = RootScope(config.default, config.args, handler as never, options?.signal)
    scope = await scope.reduce(createActor())
    const { signal: { aborted, reason } } = scope.controller
    if (aborted) {
      scope.event({
        type: "aborted",
        reason,
      })
      throw reason
    }
    scope.event({
      type: "returned",
      value: scope.value,
    })
    return scope.value
  }
}

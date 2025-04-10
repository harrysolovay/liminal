import type { Action } from "./Action.ts"
import type { Agent } from "./Agent.ts"
import type { EventHandler } from "./events/EventHandler.ts"
import type { EventResolved, ExtractEventResolved } from "./events/EventResolved.ts"
import type { LanguageModel } from "./Model.ts"
import { RootScope, type Scope } from "./Scope.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import type { JSONKey } from "./util/JSONKey.ts"

export interface ExecConfig {
  default: LanguageModel
  args?: Record<JSONKey, any>
  signal?: AbortSignal
  handler?: EventHandler
}

export type ExtractExecConfig<Y extends Action> =
  & {
    default: LanguageModel
    signal?: AbortSignal
    handler?: EventHandler<Extract<ExtractEventResolved<Y[""]> & {}, EventResolved>>
  }
  & (
    [Y[""]["Entry"]] extends [never] ? {
        args?: undefined
      }
      : {
        args: FromEntries<Y[""]["Entry"]>
      }
  )

export async function exec<Y extends Action, T>(
  createAgent: () => Agent<Y, T>,
  config: ExtractExecConfig<Y>,
): Promise<T> {
  let scope: Scope = RootScope(config as never)
  scope = await scope.reduce(createAgent())
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

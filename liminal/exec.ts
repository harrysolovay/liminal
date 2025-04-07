import type { Action } from "./Action.ts"
import type { ActorLike } from "./Actor.ts"
import type { RunInfer } from "./adapters.ts"
import type { EventHandler } from "./EventHandler.ts"
import { RootScope, type Scope } from "./Scope.ts"
import type { FromEntries } from "./util/FromEntries.ts"
import { unwrapDeferred } from "./util/unwrapDeferred.ts"

export interface ExecConfig<Y extends Action = Action, T = any> {
  default: RunInfer
  args: FromEntries<Y[""]["Entry"]>
  handler?: EventHandler<Y[""]["Event"], T>
  signal?: AbortSignal
}

// TODO: consider `Result` type.
export async function exec<Y extends Action, T>(
  actorLike: ActorLike<Y, T>,
  config: ExecConfig<Y, T>,
): Promise<T> {
  let scope: Scope = RootScope(config.default, config.args, config.handler, config.signal)
  const actor = unwrapDeferred(actorLike)
  scope = await scope.reduce(actor)
  const { signal: { aborted, reason } } = scope.controller
  if (aborted) {
    scope.event({
      type: "aborted",
      reason,
    })
    throw reason
  }
  return scope.value
}

import { type Action, type ExtractScope, type FlowLike, type Exec, _util } from "liminal"
import type { AIExecConfig } from "./AIExecConfig.js"
import { AIExecState } from "./AIExecState.js"

export function AIExec<Y extends Action, R, S extends ExtractScope<Y, R>>(
  source: FlowLike<Y, R>,
  config: AIExecConfig<S>,
): Exec<S> {
  return {
    run: (handler) =>
      new AIExecState(
        undefined,
        config,
        source,
        _util.unwrapDeferred(source),
        "default",
        [],
        new Set(),
        undefined,
        (event) => {
          return handler?.(event as never)
        },
      ).consume() as never,
  }
}

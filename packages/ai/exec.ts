import { type Action, type ExtractYScope, type FlowLike, type Event, LiminalUtil } from "liminal"
import type { ExecConfig } from "./ExecConfig.js"
import { FlowLikeExecState } from "./ExecState.js"

export async function exec<Y extends Action, R, S extends ExtractYScope<Y, R>>(
  root: FlowLike<Y, R>,
  config: ExecConfig<S>,
): Promise<Awaited<R>> {
  config.handler?.({
    type: "Enter",
    key: "Root",
  })
  const flow = LiminalUtil.unwrapDeferred(root)
  const result = new FlowLikeExecState(
    config,
    "FlowLikeExecState",
    root,
    flow,
    "default",
    [],
    new Set(),
    undefined,
  ).consume() as never
  config.handler?.({
    type: "Exit",
    key: "Root",
    result,
  })
  return result
}

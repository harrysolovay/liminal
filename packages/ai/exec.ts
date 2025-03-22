import { type Action, type ExtractYScope, type FlowLike, LiminalUtil } from "liminal"
import type { ExecConfig } from "./ExecConfig.js"
import { ExecState } from "./ExecState.js"

export async function exec<Y extends Action, R, S extends ExtractYScope<Y, R>>(
  root: FlowLike<Y, R>,
  config: ExecConfig<S>,
): Promise<Awaited<R>> {
  // enter
  const flow = LiminalUtil.unwrapDeferred(root)
  const result = new ExecState(config, root, flow, "default", [], new Set(), undefined, (event) =>
    config.handler?.(event as never),
  ).consume() as never
  // exit
  return result
}

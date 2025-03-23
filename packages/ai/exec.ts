import { type Action, type ExtractYScope, type FlowLike, _util } from "liminal"
import type { ExecConfig } from "./ExecConfig.js"
import { ExecState } from "./ExecState.js"

export async function exec<Y extends Action, R, S extends ExtractYScope<Y, R>>(
  source: FlowLike<Y, R>,
  config: ExecConfig<S>,
): Promise<Awaited<R>> {
  // enter
  const flow = _util.unwrapDeferred(source)
  const result = new ExecState(undefined, config, source, flow, "default", [], new Set(), undefined, (event) =>
    config.handler?.(event as never),
  ).consume() as never
  // exit
  return result
}

import type { Action, ExtractYScope, FlowLike } from "liminal"
import type { ExecConfig } from "./ExecConfig.js"
import { ExecState } from "./ExecState.js"

export async function exec<Y extends Action, R, S extends ExtractYScope<Y, R>>(
  root: FlowLike<Y, R>,
  config: ExecConfig<S>,
): Promise<Awaited<R>> {
  return new ExecState(config, root, "default", [], undefined, undefined, new Set()).consume() as never
}

import type { Action, ExtractYScope, FlowLike } from "liminal"
import type { ExecConfig } from "./ExecConfig.js"

export declare function exec<Y extends Action, R, S extends ExtractYScope<Y, R>>(
  root: FlowLike<Y, R>,
  config: ExecConfig<S>,
): Promise<Awaited<R>>

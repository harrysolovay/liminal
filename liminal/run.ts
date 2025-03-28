import type { ActionLike } from "./Action/Action.js"
import type { Tool } from "./Action/Tool.js"
import { StateReducers } from "./StateReducers/StateReducers.js"
import type { ActorLike } from "./common/ActorLike.js"
import type { NarrowExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import { unwrapDeferred } from "./util/unwrapDeferred.js"

export async function run<Y extends ActionLike, R>(source: ActorLike<Y, R>, config: NarrowExecConfig<Y>): Promise<R> {
  const state: ExecState = {
    config,
    source,
    actor: unwrapDeferred(source),
    system: undefined,
    next: undefined,
    parent: undefined,
    handler: (event) => config.handler?.(event),
    messages: [],
    tools: new Set<Tool>(),
  }
  const { result } = await StateReducers.reduceState(state)
  return result
}

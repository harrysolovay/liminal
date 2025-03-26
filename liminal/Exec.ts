import type { Action } from "./Action/Action.js"
import type { Tool } from "./Action/Tool.js"
import { StateReducers } from "./StateReducers/StateReducers.js"
import type { ActorLike } from "./common/ActorLike.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import { unwrapDeferred } from "./util/unwrapDeferred.js"
import { assert } from "./util/assert.js"

export async function exec<Y extends Action, R>(agent: ActorLike<Y, R>, config: ExecConfig): Promise<unknown> {
  config.models.embedding
  const languageModel = config.models.language.default
  assert(languageModel)
  const state: ExecState = {
    config,
    source: agent,
    actor: unwrapDeferred(agent),
    languageModel,
    languageModelKey: "default",
    embeddingModel: undefined,
    embeddingModelKey: config.models.embedding?.default ? "default" : undefined,
    system: undefined,
    next: undefined,
    parent: undefined,
    handler: config.handler as never,
    messages: [],
    tools: new Set<Tool>(),
  }
  return (await StateReducers.reduceState(state)) as never
}

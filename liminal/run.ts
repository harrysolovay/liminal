import type { ActionLike } from "./Action/Action.js"
import type { Tool } from "./Action/Tool.js"
import { StateReducers } from "./StateReducers/StateReducers.js"
import type { ActorLike } from "./common/ActorLike.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import { unwrapDeferred } from "./util/unwrapDeferred.js"
import { assert } from "./util/assert.js"
import type { ExtractSpec } from "./Spec.js"

export async function run<Y extends ActionLike, R, S extends ExtractSpec<Y>>(
  agent: ActorLike<Y, R>,
  config: ExecConfig<S>,
): Promise<R> {
  const languageModel = config.models.language.default
  assert(languageModel)
  const state: ExecState = {
    config,
    source: agent,
    actor: unwrapDeferred(agent),
    languageModelKey: "default",
    languageModel,
    embeddingModelKey: "default",
    embeddingModel: config.models.embedding?.default,
    system: undefined,
    next: undefined,
    parent: undefined,
    handler: config.handler as never,
    messages: [],
    tools: new Set<Tool>(),
  }
  return (await StateReducers.reduceState(state)) as never
}

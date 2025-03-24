import type { Action } from "./Action/Action.js"
import type { Tool } from "./Action/Tool.js"
import { createActionReducers } from "./reduceExecState/createActionReducers.js"
import { reduceExecState } from "./reduceExecState/reduceExecState.js"
import type { Adapter } from "./Adapter.js"
import type { AgentLike } from "./common/AgentLike.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import { unwrapDeferred } from "./liminal_util/unwrapDeferred.js"
import type { ExtractScope } from "./Scope.js"

export function Exec<Model, Message>(adapter: Adapter<Model, Message>): Exec<Model> {
  return {
    run: async (agent, config) => {
      const reducers = createActionReducers(adapter.providerReducers)
      const state: ExecState<Model, Message> = {
        models: config.models,
        source: agent,
        agent: unwrapDeferred(agent),
        modelKey: "default",
        system: undefined,
        next: undefined,
        parent: undefined,
        handler: config.handler as never,
        messages: [],
        tools: new Set<Tool>(),
      }
      return (await reduceExecState(reducers, state)) as never
    },
  }
}

export interface Exec<Model> {
  run: <Y extends Action, R, S extends ExtractScope<Y, R>>(
    agent: AgentLike<Y, R>,
    config: ExecConfig<Model, S>,
  ) => Promise<S["Result"]>
}

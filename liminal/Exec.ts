import type { Action } from "./Action/Action.js"
import type { Tool } from "./Action/Tool.js"
import { createReducers } from "./ActionReducers/createReducers.js"
import { reduce } from "./ActionReducers/reduce.js"
import type { Adapter } from "./Adapter.js"
import type { Agent } from "./common/Agent.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecState } from "./ExecState.js"
import type { ExtractScope } from "./Scope.js"

export function Exec<Model, Message>(adapter: Adapter<Model, Message>): Exec<Model> {
  return {
    run: async (agent, config) => {
      const reducers = createReducers(adapter.providerReducers)
      const state: ExecState<Model, Message> = {
        models: config.models,
        source: agent,
        agent: agent(),
        modelKey: "default",
        system: undefined,
        next: undefined,
        parent: undefined,
        handler: config.handler as never,
        messages: [],
        tools: new Set<Tool>(),
      }
      return (await reduce(reducers, state)) as never
    },
  }
}

export interface Exec<Model> {
  run: <Y extends Action, R, S extends ExtractScope<Y, R>>(
    agent: () => Agent<Y, R>,
    config: ExecConfig<Model, S>,
  ) => Promise<S["Result"]>
}
